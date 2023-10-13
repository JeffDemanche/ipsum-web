import { ContentBlock, ContentState, SelectionState } from "draft-js";
import { useMemo } from "react";
import { IpsumEntityTransformer } from "util/entities";

const contentStateFromSelection = ({
  contentState,
  selectionState,
}: {
  contentState: ContentState;
  selectionState: SelectionState;
}) => {
  const entityMap = contentState.getEntityMap();
  const startKey = selectionState.getStartKey();
  const endKey = selectionState.getEndKey();
  const blocks = contentState.getBlockMap();
  let lastWasEnd = false;
  const selectedBlocks = blocks
    .skipUntil((block) => {
      return block?.getKey() === startKey;
    })
    .takeUntil((block) => {
      const result = lastWasEnd;
      if (block?.getKey() === endKey) {
        lastWasEnd = true;
      }

      return result;
    });
  const blockArray: Array<ContentBlock> = [];
  selectedBlocks.forEach((block, key) => {
    if (block) {
      if (key === startKey && key === endKey) {
        const newText = block
          .getText()
          .slice(
            selectionState.getStartOffset(),
            selectionState.getEndOffset()
          );
        const newCharacterList = block
          .getCharacterList()
          .slice(
            selectionState.getStartOffset(),
            selectionState.getEndOffset()
          );
        const newBlock = block
          .set("characterList", newCharacterList)
          .set("text", newText) as ContentBlock;
        blockArray.push(newBlock);
      } else if (key === startKey) {
        const newText = block.getText().slice(selectionState.getStartOffset());
        const newCharacterList = block
          .getCharacterList()
          .slice(selectionState.getStartOffset());
        const newBlock = block
          .set("characterList", newCharacterList)
          .set("text", newText) as ContentBlock;
        blockArray.push(newBlock);
      } else if (key === endKey) {
        const newText = block.getText().slice(0, selectionState.getEndOffset());
        const newCharacterList = block
          .getCharacterList()
          .slice(0, selectionState.getEndOffset());
        const newBlock = block
          .set("characterList", newCharacterList)
          .set("text", newText) as ContentBlock;
        blockArray.push(newBlock);
      } else {
        blockArray.push(block);
      }
    }
  });
  const newContentState = ContentState.createFromBlockArray(
    blockArray,
    entityMap
  );
  return newContentState;
};

export const useExcerptContentState = ({
  entryContentState,
  highlightId,
}: {
  entryContentState: ContentState;
  highlightId: string;
}) => {
  const excerptCS = useMemo(() => {
    if (!entryContentState) return ContentState.createFromText("");

    const highlightSelectionState = new IpsumEntityTransformer(
      entryContentState
    ).getHighlightSelectionState(highlightId);

    if (!highlightSelectionState)
      return ContentState.createFromText("(Empty highlight)");

    return contentStateFromSelection({
      contentState: entryContentState,
      selectionState: highlightSelectionState,
    });
  }, [entryContentState, highlightId]);
  return excerptCS;
};
