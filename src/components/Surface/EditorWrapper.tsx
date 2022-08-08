import { Editor, EditorProps } from "draft-js";
import React, { useMemo } from "react";
import { IpsumSelectionState } from "util/selection";

interface EditorWrapperProps {
  enableHighlights: boolean;
}

type EditorWrapperPropsCombined = EditorWrapperProps &
  EditorProps & { ref: React.LegacyRef<Editor> };

export const EditorWrapper: React.FC<EditorWrapperPropsCombined> = ({
  enableHighlights,
  ...editorProps
}: EditorWrapperPropsCombined) => {
  const editorState = editorProps.editorState;

  const selectionState = editorState.getSelection();
  const ipsumSelectionState = useMemo(
    () => new IpsumSelectionState(selectionState),
    [selectionState]
  );

  const showNewArcPopover = useMemo(
    () => ipsumSelectionState.isSomethingSelected(),
    [ipsumSelectionState]
  );

  return <Editor {...editorProps}></Editor>;
};
