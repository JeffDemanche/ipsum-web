/**
 * Deals with complex transformations for applying DraftJS entities for arcs,
 * adding abilities like multiple arcs for the same characters.
 */

import { ContentState, Modifier, SelectionState } from "draft-js";
import _ from "underscore";
import { setEquals } from "./set";

interface CharacterMetadata {
  char: string;
  block: string;
  blockOffset: number;
  entityId: string;
}

type EntityField = "arcIds" | "textArcAssignments" | "commentIds";

type EntityFieldDataType<T extends EntityField> = T extends "arcIds"
  ? string
  : T extends "textArcAssignments"
  ? { arcId?: string; arcAssignmentId: string }
  : string;

/**
 * This should be a map of arrays. Adding non-array fields will break
 * `applyEntityData` and possibly other methods.
 */
export interface IpsumEntityData {
  arcIds?: EntityFieldDataType<"arcIds">[];
  textArcAssignments?: EntityFieldDataType<"textArcAssignments">[];
  commentIds?: EntityFieldDataType<"commentIds">[];
}

export class IpsumEntityTransformer {
  private _contentState: ContentState;

  constructor(contentState: ContentState) {
    this._contentState = contentState;
  }

  get contentState() {
    return this._contentState;
  }

  /**
   * A helper function that iterates through a selection state which might
   * contain multiple blocks and builds a sequence of characters in that
   * selection with entity-related metadata.
   *
   * @param selectionState
   */
  getCharacters = (selectionState?: SelectionState): CharacterMetadata[] => {
    if (!selectionState) {
      const firstBlock = this.contentState.getFirstBlock();
      const lastBlock = this.contentState.getLastBlock();
      selectionState = SelectionState.createEmpty(firstBlock.getKey()).merge({
        anchorKey: firstBlock.getKey(),
        anchorOffset: 0,
        focusKey: lastBlock.getKey(),
        focusOffset: lastBlock.getText().length,
      });
    }

    const contentBlocks = this.contentState.getBlocksAsArray();

    const charData: CharacterMetadata[] = [];

    const char = (block: string, charOffset: number) => {
      const entityId = this.contentState
        .getBlockMap()
        .get(block)
        .getEntityAt(charOffset);

      charData.push({
        char: this.contentState.getBlockMap().get(block).getText()[charOffset],
        block,
        blockOffset: charOffset,
        entityId,
      });
    };

    let traversing = false;
    contentBlocks.forEach((block) => {
      const blockContainsSelStart =
        block.getKey() === selectionState.getStartKey();
      const blockContainsSelEnd = block.getKey() === selectionState.getEndKey();

      if (traversing) {
        if (blockContainsSelEnd) traversing = false;

        const blockSelStart = 0;
        const blockSelEnd = blockContainsSelEnd
          ? selectionState.getEndOffset()
          : block.getLength();
        for (let i = blockSelStart; i < blockSelEnd; i++) {
          char(block.getKey(), i);
        }
      } else if (blockContainsSelStart) {
        traversing = !blockContainsSelEnd;
        const blockSelStart = selectionState.getStartOffset();
        const blockSelEnd = blockContainsSelEnd
          ? selectionState.getEndOffset()
          : block.getLength();
        for (let i = blockSelStart; i < blockSelEnd; i++) {
          char(block.getKey(), i);
        }
      }
    });

    return charData;
  };

  /**
   * Compares two entity data, useful for determining where an entity range
   * starts or stops.
   */
  entityDataEquals = (
    entityData1: IpsumEntityData,
    entityData2: IpsumEntityData
  ) => {
    const fieldEquality = (arr1: string[], arr2: string[]) =>
      setEquals(new Set(arr1 ?? []), new Set(arr2 ?? []));

    return (
      fieldEquality(entityData1?.arcIds, entityData2?.arcIds) &&
      _.isEqual(
        entityData1?.textArcAssignments,
        entityData2?.textArcAssignments
      ) &&
      fieldEquality(entityData1?.commentIds, entityData2?.commentIds)
    );
  };

  private entityDataDefined = (entityData: IpsumEntityData) => {
    return (
      !!entityData?.arcIds?.length || !!entityData?.textArcAssignments?.length
    );
  };

  private getEntityRanges = (selectedCharacters: CharacterMetadata[]) => {
    if (selectedCharacters.length === 0) return [];

    const getEntityData = (char: CharacterMetadata) => {
      if (!char.entityId) return null;
      return this.contentState.getEntity(char.entityId).getData();
    };

    const newEntityRanges: {
      entityRangeSelState: SelectionState;
      entityData: IpsumEntityData;
    }[] = [];

    let currStartOffset = selectedCharacters[0].blockOffset;
    let currStartBlock = selectedCharacters[0].block;

    for (let i = 1; i <= selectedCharacters.length; i++) {
      if (i === selectedCharacters.length) {
        newEntityRanges.push({
          entityRangeSelState: SelectionState.createEmpty(currStartBlock).merge(
            {
              anchorKey: currStartBlock,
              anchorOffset: currStartOffset,
              focusKey: selectedCharacters[i - 1].block,
              focusOffset: selectedCharacters[i - 1].blockOffset + 1,
            }
          ),
          entityData: getEntityData(selectedCharacters[i - 1]),
        });
        break;
      } else if (
        !this.entityDataEquals(
          getEntityData(selectedCharacters[i]),
          getEntityData(selectedCharacters[i - 1])
        )
      ) {
        newEntityRanges.push({
          entityRangeSelState: SelectionState.createEmpty(currStartBlock).merge(
            {
              anchorKey: currStartBlock,
              anchorOffset: currStartOffset,
              focusKey: selectedCharacters[i - 1].block,
              focusOffset: selectedCharacters[i - 1].blockOffset + 1,
            }
          ),
          entityData: getEntityData(selectedCharacters[i - 1]),
        });
        currStartOffset = selectedCharacters[i].blockOffset;
        currStartBlock = selectedCharacters[i].block;
      }
    }
    return newEntityRanges;
  };

  /**
   * Removes all entity assignments from the `ContentState`. Currently doesn't
   * remove the entities from the ContentState's entityMap, which would be
   * better for memory purposes but isn't crucial for functionality.
   */
  clearEntities = (): IpsumEntityTransformer => {
    let newContentState = this.contentState;
    this.contentState.getBlockMap().forEach((block) => {
      const blockKey = block.getKey();
      const blockText = block.getText();
      const selection = SelectionState.createEmpty(blockKey);
      const updatedSelection = selection.merge({
        anchorOffset: 0,
        focusOffset: blockText.length,
      });
      newContentState = Modifier.applyEntity(
        newContentState,
        updatedSelection,
        null
      );
    });
    return new IpsumEntityTransformer(newContentState);
  };

  /**
   * Applies new DraftJS entity data to a selection state. "Applies" here means
   * that for each array subfield of `data`, the `IpsumEntityData` array
   * subfields for the selected text will be updated to include any *new* values
   * present in the arrays provided as subfields of `data`.
   *
   * @param data A partial of `IpsumEntityState`, where any values present in
   * the subfields will be added as entities to the selected text if they aren't
   * already present.
   */
  applyEntityData = <T extends EntityField>(
    selectionState: SelectionState,
    type: T,
    data: EntityFieldDataType<T>
  ) => {
    if (selectionState.isEmpty()) return this;

    // 1. Get an array that contains data on every character in the
    //    SelectionState.
    const selectedCharacters = this.getCharacters(selectionState);

    // 2. Iterate through the characters, building an array for which every
    //    entry contains a SelectionState range for an entity we will create,
    //    and the IpsumEntityData that already exist on that range.
    const newEntityRanges = this.getEntityRanges(selectedCharacters);

    // 3. Loop through the array of text ranges... for each, create and assign a
    //    new DraftJS entity which appends the data provided as a parameter.
    let contentStateWithAppliedEntities: ContentState = this.contentState;
    newEntityRanges.forEach(({ entityRangeSelState, entityData }) => {
      // Copy of existing entity data for range.
      const newEntityData = { ...entityData } as IpsumEntityData;

      const existingValueArray: IpsumEntityData[T] = entityData?.[type] ?? [];
      const newValueArray = [...existingValueArray] as EntityFieldDataType<T>[];

      if (
        Array.isArray(existingValueArray) &&
        !(existingValueArray as unknown[]).find((value) =>
          _.isEqual(value, data)
        )
      ) {
        newValueArray.push(data);
      }

      // Subfields should be undefined rather than an empty array by
      // convention.
      if (newValueArray.length > 0)
        (newEntityData[type] as EntityFieldDataType<T>[]) = newValueArray;
      else delete newEntityData[type];

      // Only add an entity if the entity data has changed.
      if (!this.entityDataEquals(entityData, newEntityData)) {
        const contentStateWithEntity =
          contentStateWithAppliedEntities.createEntity(
            "ARC",
            "MUTABLE",
            newEntityData
          );

        const entityKey = contentStateWithEntity.getLastCreatedEntityKey();

        contentStateWithAppliedEntities = Modifier.applyEntity(
          contentStateWithEntity,
          entityRangeSelState,
          entityKey
        );
      }
    });

    return new IpsumEntityTransformer(contentStateWithAppliedEntities);
  };

  removeEntityData = <T extends EntityField>(
    type: T,
    data: EntityFieldDataType<T>,
    filterFn?: (existingData: EntityFieldDataType<T>) => boolean
  ) => {
    const entityKeys = this.contentState.getAllEntities().keySeq().toArray();

    const newContentState = entityKeys.reduce((acc, cur) => {
      const currentEntityData: IpsumEntityData = {
        ...this.contentState.getEntity(cur).getData(),
      };

      const newFieldData = (
        currentEntityData[type] as EntityFieldDataType<T>[]
      ).filter((existingData) => {
        return filterFn
          ? filterFn(existingData)
          : !_.isEqual(data, existingData);
      });

      return acc.mergeEntityData(cur, { [type]: newFieldData });
    }, this.contentState);

    return new IpsumEntityTransformer(newContentState).removeEmptyEntities();
  };

  /**
   * @deprecated Use `applyEntityData`
   */
  applyArc = (
    selectionState: SelectionState,
    arcId: string
  ): IpsumEntityTransformer => {
    return this.applyEntityData(selectionState, "arcIds", arcId);
  };

  /**
   * @deprecated Use `removeEntityData`
   */
  removeArc = (arcId: string): IpsumEntityTransformer => {
    return this.removeEntityData("arcIds", arcId);
  };

  /**
   * Applies `null` to any entity ranges which are "empty" (see
   * `entityDataDefined`). This
   */
  removeEmptyEntities = () => {
    const allCharacters = this.getCharacters();
    const entityRanges = this.getEntityRanges(allCharacters);

    let newContentState = this.contentState;

    entityRanges.forEach((range) => {
      if (!this.entityDataDefined(range.entityData)) {
        newContentState = Modifier.applyEntity(
          newContentState,
          range.entityRangeSelState,
          null
        );
      }
    });

    return new IpsumEntityTransformer(newContentState);
  };

  /**
   * Returns an array of all arcs which are *applied* on the `ContentState`.
   * *Applied* here implies that the arc exists on an entity with a non-empty
   * range in the `ContentState` (the `ContentState`'s entity map could contain
   * entities that aren't actually applied in the content).
   */
  getAppliedArcs = () => {
    const allCharacters = this.getCharacters();
    const arcIds = new Set<string>();
    this.getEntityRanges(allCharacters).forEach((entityRange) => {
      entityRange.entityData?.arcIds?.forEach((arcId) => arcIds.add(arcId));
    });
    return Array.from(arcIds);
  };

  getAppliedTextArcAssignments = () => {
    const allCharacters = this.getCharacters();
    const textArcAssignments: EntityFieldDataType<"textArcAssignments">[] = [];
    this.getEntityRanges(allCharacters).forEach((entityRange) => {
      entityRange.entityData?.textArcAssignments?.forEach((taa) =>
        textArcAssignments.push(taa)
      );
    });
    return textArcAssignments;
  };

  /**
   * Returns a SelectionState for the entity that matches the provided
   * highlightId (currently this matches textArcAssignment.arcAssignmentId,
   * though that nomenclature should change).
   */
  getHighlightSelectionState = (highlightId: string) => {
    const allCharacters = this.getCharacters();
    let startBlock: string;
    let startOffset: number;
    let endBlock: string;
    let endOffset: number;

    this.getEntityRanges(allCharacters).forEach((entityRange) => {
      if (!entityRange.entityData) return;
      if (
        entityRange.entityData.textArcAssignments.find(
          (assgn) => assgn.arcAssignmentId === highlightId
        )
      ) {
        if (!startBlock) {
          startBlock = entityRange.entityRangeSelState.getStartKey();
          startOffset = entityRange.entityRangeSelState.getStartOffset();
        }

        endBlock = entityRange.entityRangeSelState.getEndKey();
        endOffset = entityRange.entityRangeSelState.getEndOffset();
      }
    });

    if (!startBlock) return undefined;

    return SelectionState.createEmpty(startBlock).merge({
      anchorKey: startBlock,
      focusKey: endBlock,
      anchorOffset: startOffset,
      focusOffset: endOffset,
    });
  };
}
