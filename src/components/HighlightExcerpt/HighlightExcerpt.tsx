import { Paper } from "@mui/material";
import { decorator } from "components/Decorator";
import { Editor, EditorState } from "draft-js";
import React, { useCallback, useMemo } from "react";
import { useStateDocumentQuery } from "state/in-memory";
import { parseContentState } from "util/content-state";
import styles from "./HighlightExcerpt.less";
import { useExcerptContentState } from "./useExcerpt";

interface HighlightExcerptProps {
  highlightId: string;
}

export const HighlightExcerpt: React.FunctionComponent<
  HighlightExcerptProps
> = ({ highlightId }) => {
  const { data: highlightData } = useStateDocumentQuery({
    collection: "highlight",
    keys: [highlightId],
  });
  const highlight = highlightData[highlightId];

  const { data: entryData } = useStateDocumentQuery({
    collection: "entry",
    keys: [highlight?.entryKey],
  });
  const entry = entryData[highlight?.entryKey];
  const entryContentState = entry
    ? parseContentState(entry.contentState)
    : undefined;

  const excerptContentState = useExcerptContentState({
    entryContentState,
    highlightId,
  });

  const editorState = useMemo(
    () => EditorState.createWithContent(excerptContentState, decorator),
    [excerptContentState]
  );

  const onEditorChange = useCallback(() => {}, []);

  return (
    <Paper sx={{ borderRadius: "0" }} className={styles["excerpt"]}>
      <Editor editorState={editorState} onChange={onEditorChange}></Editor>
    </Paper>
  );
};
