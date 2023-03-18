import { ContentBlock, ContentState, SelectionState } from "draft-js";
import { useMemo } from "react";
import { IpsumEntityTransformer } from "util/entities";

const contentStateFromSelection = (
  contentState: ContentState,
  selectionState: SelectionState
) => {
  const newBlockArray: ContentBlock[] = [];
  let copy = false;
  for (const block of contentState.getBlocksAsArray()) {
    if (block.getKey() === selectionState.getStartKey()) {
      copy = true;
    }
    if (copy) {
      newBlockArray.push(block);
    }
    if (block.getKey() === selectionState.getEndKey()) {
      break;
    }
  }
  return ContentState.createFromBlockArray(newBlockArray);
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

    return contentStateFromSelection(
      entryContentState,
      highlightSelectionState
    );
  }, [entryContentState, highlightId]);

  return excerptCS;
};
