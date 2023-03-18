import { ContentState, Modifier, SelectionState } from "draft-js";
import { useMemo } from "react";
import { IpsumEntityTransformer } from "util/entities";

const contentStateFromSelection = (
  contentState: ContentState,
  selectionState: SelectionState
) => {
  const firstBlock = contentState.getFirstBlock();
  const lastBlock = contentState.getLastBlock();
  const entireSelection = SelectionState.createEmpty(firstBlock.getKey()).merge(
    {
      anchorKey: firstBlock.getKey(),
      anchorOffset: 0,
      focusKey: lastBlock.getKey(),
      focusOffset: lastBlock.getText().length,
    }
  );

  return Modifier.moveText(contentState, selectionState, entireSelection);
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
