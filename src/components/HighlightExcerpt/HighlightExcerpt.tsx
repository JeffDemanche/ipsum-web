import { useQuery } from "@apollo/client";
import { Paper } from "@mui/material";
import { decorator } from "components/Decorator";
import { blockStyleFn } from "components/EditorWrapper";
import { Editor, EditorState } from "draft-js";
import React, { useCallback, useMemo } from "react";
import { gql } from "util/apollo";
import { parseContentState } from "util/content-state";
import styles from "./HighlightExcerpt.less";
import { useExcerptContentState } from "./useExcerpt";

interface HighlightExcerptProps {
  highlightId: string;
}

export const HighlightExcerptQuery = gql(`
  query HighlightExcerpt($highlightId: ID!) {
    highlights(ids: [$highlightId]) {
      id
      entry {
        entryKey
        contentState
      }
    }
  }
`);

export const HighlightExcerpt: React.FunctionComponent<
  HighlightExcerptProps
> = ({ highlightId }) => {
  const {
    data: { highlights },
  } = useQuery(HighlightExcerptQuery, { variables: { highlightId } });
  const highlight = highlights?.[0];

  const entry = highlight?.entry;
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
      <Editor
        editorState={editorState}
        blockStyleFn={blockStyleFn}
        onChange={onEditorChange}
      ></Editor>
    </Paper>
  );
};
