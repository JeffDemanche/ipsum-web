import React, { useCallback, useState } from "react";
import styles from "./Surface.less";
import { Editor, EditorState, RichUtils } from "draft-js";
import { SurfaceControls } from "./SurfaceControls";

export const SurfaceEditor: React.FC<{}> = () => {
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );

  const handleKeyCommand = useCallback(
    (command: string, editorState: EditorState, eventTimeStamp: number) => {
      const newState = RichUtils.handleKeyCommand(editorState, command);
      if (newState) {
        setEditorState(newState);
        return "handled";
      } else return "not-handled";
    },
    []
  );

  return (
    <>
      <Editor
        editorState={editorState}
        onChange={setEditorState}
        handleKeyCommand={handleKeyCommand}
      ></Editor>
      <SurfaceControls
        editorState={editorState}
        setEditorState={setEditorState}
      />
    </>
  );
};
