/**
 * Deals with complex transformations for applying DraftJS entities for arcs,
 * adding abilities like multiple arcs for the same characters.
 */

import { ContentState, Modifier, SelectionState } from "draft-js";

interface CharacterMetadata {
  char: string;
  block: string;
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
          : block.getLength() - 1;
        for (let i = blockSelStart; i < blockSelEnd; i++) {
          char(block.getKey(), i);
        }
      } else if (blockContainsSelStart) {
        traversing = true;
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

  applyArc = (
    selectionState: SelectionState,
    arcId: string
  ): IpsumEntityTransformer => {
    const contentStateWithEntity = this.contentState.createEntity(
      "ARC",
      "MUTABLE",
      {
        arcId,
      }
    );
    const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
    const contentStateWithArc = Modifier.applyEntity(
      contentStateWithEntity,
      selectionState,
      entityKey
    );
    return new IpsumEntityTransformer(contentStateWithArc);
  };
}
