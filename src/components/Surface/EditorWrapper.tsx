import { Editor, EditorProps } from "draft-js";
import React, { useContext } from "react";
import { TextRangeHighlight } from "components/EditorSelection/TextRangeHighlight";
import { EditorSelectionContext } from "components/EditorSelection/EditorSelectionContext";

interface EditorWrapperProps {
  enableHighlights: boolean;
}

type EditorWrapperPropsCombined = EditorWrapperProps &
  EditorProps & { ref: React.Ref<Editor> };

export const EditorWrapper: React.FC<EditorWrapperPropsCombined> =
  React.forwardRef<Editor, EditorWrapperPropsCombined>((props, ref) => {
    const { getSelection } = useContext(EditorSelectionContext);

    const editorSelection = getSelection(props.editorKey);
    const range = editorSelection.getRange();

    return (
      <div>
        <Editor {...props} ref={ref}></Editor>
        <TextRangeHighlight range={range} color={"black"}></TextRangeHighlight>
      </div>
    );
  });

EditorWrapper.displayName = "EditorWrapper";
