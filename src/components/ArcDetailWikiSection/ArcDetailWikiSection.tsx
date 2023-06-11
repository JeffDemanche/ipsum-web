import { ArcDetailContext, ArcDetailSection } from "components/ArcDetail";
import { EditorWrapper, useEntryEditor } from "components/EditorWrapper";
import React, { useContext } from "react";

export const ArcDetailWikiSection: React.FunctionComponent = () => {
  const { arcId } = useContext(ArcDetailContext);

  const onChange = () => {};

  const { editorRef, editorState } = useEntryEditor({
    entryKey: `arc-entry-${arcId}`,
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
