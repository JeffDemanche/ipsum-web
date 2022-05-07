import React, { useCallback, useContext, useEffect } from "react";
import styles from "./Surface.less";
import { Editor, EditorState, RichUtils } from "draft-js";
import { SurfaceControls } from "./SurfaceControls";
import { SurfaceEditorContext } from "./SurfaceEditorContext";

export const SurfaceEditor: React.FC<{}> = () => {
  const { editorState, setEditorState, domEditorRef } =
    useContext(SurfaceEditorContext);

  // We listen for clicks on Surface to move the focus to the end of the Editor,
  // this is a hacky way of overriding that if the click is on the Editor
  // itself.
  useEffect(() => {
    domEditorRef.current.editor.onclick = (e) => {
      e.stopPropagation();
    };
  }, [domEditorRef.current]);

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
        ref={domEditorRef}
      ></Editor>
      <SurfaceControls
        editorState={editorState}
        setEditorState={setEditorState}
      />
    </>
  );
};
