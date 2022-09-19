/**
 * Deals with complex transformations for applying DraftJS entities for arcs,
 * adding abilities like multiple arcs for the same characters.
 */

import { ContentState, Modifier, SelectionState } from "draft-js";
import { setEquals } from "./set-equals";

interface CharacterMetadata {
  char: string;
  block: string;
  blockOffset: number;
  entityId: string;
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
   */
  getSelectedCharacters = (
    selectionState: SelectionState
  ): CharacterMetadata[] => {
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
    const selectedCharacters = this.getSelectedCharacters(selectionState);

    const getEntityData = (char: CharacterMetadata) => {
      if (!char.entityId) return null;
      return this.contentState.getEntity(char.entityId).getData();
    };

    // 2. Iterate through the characters, building an array for which every
    //    entry contains a SelectionState range for an entity we will create,
    //    and an array of the arc IDs which already exist for it.
    const newEntityRanges: {
      entityRangeSelState: SelectionState;
      existingArcIds: string[];
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
          existingArcIds: getEntityData(selectedCharacters[i - 1])?.arcIds,
        });
        break;
      } else if (
        !setEquals(
          new Set(getEntityData(selectedCharacters[i])?.arcIds ?? []),
          new Set(getEntityData(selectedCharacters[i - 1])?.arcIds ?? [])
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
          existingArcIds: getEntityData(selectedCharacters[i - 1])?.arcIds,
        });
        currStartOffset = selectedCharacters[i].blockOffset;
        currStartBlock = selectedCharacters[i].block;
      }
    }

    // 3. Loop through the array of text ranges... for each, create and assign a
    //    new DraftJS entity which includes the new arc ID as well as existing
    //    ones.
    let contentStateWithAppliedEntities: ContentState = this.contentState;
    newEntityRanges.forEach(({ entityRangeSelState, existingArcIds }) => {
      const contentStateWithEntity =
        contentStateWithAppliedEntities.createEntity("ARC", "MUTABLE", {
          arcIds: [...(existingArcIds ?? []), arcId],
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
}
