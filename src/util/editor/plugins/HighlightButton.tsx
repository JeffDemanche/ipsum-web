import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { Highlight } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import React, { useCallback } from "react";
import { createHighlight } from "util/apollo";
import { TOGGLE_HIGHLIGHT_ASSIGNMENT_COMMAND } from "./HighlightAssignmentPlugin";

interface HighlightButtonProps {
  entryKey: string;
}

export const HighlightButton: React.FunctionComponent<HighlightButtonProps> = ({
  entryKey,
}) => {
  const [editor] = useLexicalComposerContext();

  const onHighlightClick = useCallback(() => {
    const highlight = createHighlight({ entry: entryKey });

    editor.update(() => {
      editor.dispatchCommand(TOGGLE_HIGHLIGHT_ASSIGNMENT_COMMAND, {
        highlightId: highlight.id,
      });
    });
  }, [editor, entryKey]);

  return (
    <IconButton data-testid="apply-highlight-button" onClick={onHighlightClick}>
      <Highlight></Highlight>
    </IconButton>
  );
};
