import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { Highlight } from "@mui/icons-material";
import { IconButton, Tooltip } from "@mui/material";
import { DiptychContext } from "components/DiptychContext";
import React, { useCallback, useContext } from "react";
import { createHighlight } from "util/apollo";
import { TOGGLE_HIGHLIGHT_ASSIGNMENT_COMMAND } from "./HighlightAssignmentPlugin";
import styles from "./HighlightButton.less";

interface HighlightButtonProps {
  entryKey: string;
}

export const HighlightButton: React.FunctionComponent<HighlightButtonProps> = ({
  entryKey,
}) => {
  const [editor] = useLexicalComposerContext();

  const { setSelectedHighlightId } = useContext(DiptychContext);

  const onHighlightClick = useCallback(() => {
    const highlight = createHighlight({ entry: entryKey });

    editor.update(() => {
      editor.dispatchCommand(TOGGLE_HIGHLIGHT_ASSIGNMENT_COMMAND, {
        highlightId: highlight.id,
      });
    });

    setSelectedHighlightId(highlight.id);
  }, [editor, entryKey, setSelectedHighlightId]);

  return (
    <Tooltip title="Create new highlight from selection">
      <IconButton
        className={styles["highlight-button"]}
        data-testid="apply-highlight-button"
        onClick={onHighlightClick}
      >
        <Highlight></Highlight>
      </IconButton>
    </Tooltip>
  );
};
