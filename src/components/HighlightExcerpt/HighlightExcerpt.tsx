import { Editor, EditorState } from "draft-js";
import React, { useCallback, useState } from "react";
import { useStateDocumentQuery } from "state/in-memory";
import { parseContentState } from "util/content-state";
import { IpsumEntityTransformer } from "util/entities";
import styles from "./HighlightExcerpt.less";

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
    keys: [highlight.entryKey],
  });
  const entryContentState = parseContentState(
    entryData[highlight.entryKey].contentState
  );
  // const entityT = new IpsumEntityTransformer(entryContentState);

  const [editorState] = useState(EditorState.createEmpty());

  const onEditorChange = useCallback(() => {}, []);

  return (
    <div className={styles["excerpt"]}>
      <Editor editorState={editorState} onChange={onEditorChange}></Editor>
    </div>
  );
};
