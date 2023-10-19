import { ContentBlock, ContentState, Modifier, SelectionState } from "draft-js";
import { useMemo } from "react";
import { OrderedSet } from "immutable";
import { IpsumEntityTransformer } from "util/entities";

const contentStateFromSelection = ({
  contentState,
  selectionState,
  charLimit,
}: {
  contentState: ContentState;
  selectionState: SelectionState;
  charLimit?: number;
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

  let traversedChars = 0;
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
          .set(
            "text",
            charLimit ? newText.slice(0, charLimit) : newText
          ) as ContentBlock;
        blockArray.push(newBlock);
        traversedChars += newText.length;
      } else if (key === startKey) {
        const newText = block.getText().slice(selectionState.getStartOffset());
        const newCharacterList = block
          .getCharacterList()
          .slice(selectionState.getStartOffset());
        const adjustedCharLimit = charLimit
          ? charLimit - traversedChars
          : undefined;
        const newBlock = block
          .set("characterList", newCharacterList)
          .set(
            "text",
            charLimit ? newText.slice(0, adjustedCharLimit) : newText
          ) as ContentBlock;
        blockArray.push(newBlock);
        traversedChars += newText.length;
      } else if (key === endKey) {
        const newText = block.getText().slice(0, selectionState.getEndOffset());
        const newCharacterList = block
          .getCharacterList()
          .slice(0, selectionState.getEndOffset());
        const adjustedCharLimit = charLimit
          ? charLimit - traversedChars
          : undefined;
        if (adjustedCharLimit && adjustedCharLimit <= 0) return;
        const newBlock = block
          .set("characterList", newCharacterList)
          .set(
            "text",
            charLimit ? newText.slice(0, adjustedCharLimit) : newText
          ) as ContentBlock;
        blockArray.push(newBlock);
        traversedChars += newText.length;
      } else {
        const adjustedCharLimit = charLimit
          ? charLimit - traversedChars
          : undefined;
        if (adjustedCharLimit && adjustedCharLimit <= 0) return;
        const blockText = block.getText();
        traversedChars += blockText.length;
        blockArray.push(
          block.set(
            "text",
            charLimit ? blockText.slice(0, adjustedCharLimit) : blockText
          ) as ContentBlock
        );
      }
    }
  });
  let newContentState = ContentState.createFromBlockArray(
    blockArray,
    entityMap
  );

  const truncatedChars = charLimit && traversedChars > (charLimit || 0);

  if (truncatedChars) {
    newContentState = Modifier.insertText(
      newContentState,
      new SelectionState({
        anchorKey: newContentState.getLastBlock().getKey(),
        anchorOffset: newContentState.getLastBlock().getLength(),
        focusKey: newContentState.getLastBlock().getKey(),
        focusOffset: newContentState.getLastBlock().getLength(),
      }),
      "...",
      OrderedSet.of("BOLD")
    );
  }

  return {
    excerptContentState: newContentState,
    truncatedChars,
  };
};

export const useExcerptContentState = ({
  entryContentState,
  highlightId,
  charLimit,
}: {
  entryContentState: ContentState;
  highlightId: string;
  charLimit?: number;
}) => {
  const result = useMemo(() => {
    if (!entryContentState)
      return {
        excerptContentState: ContentState.createFromText(""),
        truncatedChars: false,
      };

    const highlightSelectionState = new IpsumEntityTransformer(
      entryContentState
    ).getHighlightSelectionState(highlightId);

    if (!highlightSelectionState)
      return {
        excerptContentState: ContentState.createFromText("(Empty highlight)"),
        truncatedChars: false,
      };

    return contentStateFromSelection({
      contentState: entryContentState,
      selectionState: highlightSelectionState,
      charLimit,
    });
  }, [charLimit, entryContentState, highlightId]);
  return result;
};
