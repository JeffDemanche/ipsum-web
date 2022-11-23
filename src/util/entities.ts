/**
 * Deals with complex transformations for applying DraftJS entities for arcs,
 * adding abilities like multiple arcs for the same characters.
 */

import { ContentState, Modifier, SelectionState } from "draft-js";
import { setEquals } from "./set";

interface CharacterMetadata {
  char: string;
  block: string;
  blockOffset: number;
  entityId: string;
}

interface IpsumEntityData {
  arcIds?: string[];
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

  entityDataEquals = (
    entityData1: IpsumEntityData,
    entityData2: IpsumEntityData
  ) => {
    return setEquals(
      new Set(entityData1?.arcIds ?? []),
      new Set(entityData2?.arcIds ?? [])
    );
  };

  private entityDataDefined = (entityData: IpsumEntityData) => {
    return !!entityData?.arcIds.length;
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
   * Creates a new DraftJS `ContentState` where the given `arcId` has been
   * appended to entity data for the range specified by `selectionState`.
   * DraftJS doesn't support multiple entities per character on a
   * `ContentState`. To get around that limitation, a new entity is created for
   * each span of text for which the set of arcs in that span are equal.
   *
   * @returns A new transformer, with a new `ContentState` in which the entities
   * have been updated with the arc ID.
   */
  applyArc = (
    selectionState: SelectionState,
    arcId: string
  ): IpsumEntityTransformer => {
    if (selectionState.isEmpty()) return this;

    // 1. Get an array that contains data on every character in the
    //    SelectionState.
    const selectedCharacters = this.getCharacters(selectionState);

    // 2. Iterate through the characters, building an array for which every
    //    entry contains a SelectionState range for an entity we will create,
    //    and an array of the arc IDs which already exist for it.
    const newEntityRanges = this.getEntityRanges(selectedCharacters);

    // 3. Loop through the array of text ranges... for each, create and assign a
    //    new DraftJS entity which includes the new arc ID as well as existing
    //    ones.
    let contentStateWithAppliedEntities: ContentState = this.contentState;
    newEntityRanges.forEach(({ entityRangeSelState, entityData }) => {
      const existingArcIds = new Set(entityData?.arcIds as string[]);

      const newArcIds = [...(Array.from(existingArcIds) ?? [])];
      if (!existingArcIds.has(arcId)) newArcIds.push(arcId);

      const contentStateWithEntity =
        contentStateWithAppliedEntities.createEntity("ARC", "MUTABLE", {
          arcIds: newArcIds,
        });
      const entityKey = contentStateWithEntity.getLastCreatedEntityKey();

      contentStateWithAppliedEntities = Modifier.applyEntity(
        contentStateWithEntity,
        entityRangeSelState,
        entityKey
      );
    });

    return new IpsumEntityTransformer(contentStateWithAppliedEntities);
  };

  removeArc = (arcId: string): IpsumEntityTransformer => {
    const entityKeys = this.contentState.getAllEntities().keySeq().toArray();

    const newContentState = entityKeys.reduce((acc, cur) => {
      const currentEntityData = {
        ...this.contentState.getEntity(cur).getData(),
      };

      const newArcIds = (currentEntityData.arcIds as string[]).filter(
        (id) => id !== arcId
      );

      return acc.mergeEntityData(cur, { arcIds: newArcIds });
    }, this.contentState);

    return new IpsumEntityTransformer(newContentState).removeEmptyEntities();
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
}
