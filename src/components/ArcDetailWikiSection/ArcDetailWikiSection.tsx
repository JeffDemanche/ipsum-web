import { ArcDetailSection } from "components/ArcDetail";
import { EditorWrapper, useEntryEditor } from "components/EditorWrapper";
import React from "react";

export const ArcDetailWikiSection: React.FunctionComponent = () => {
  const onChange = () => {};

  const { editorRef, editorState, empty } = useEntryEditor({
    entryKey: "test",
  });

  return (
    <ArcDetailSection>
      {editorState && (
        <EditorWrapper
          enableControls
          enableHighlights
          onChange={onChange}
          editorState={editorState}
          ref={editorRef}
        ></EditorWrapper>
      )}
    </ArcDetailSection>
  );
};
