import { Editor, EditorState, RichUtils } from "draft-js";
import React, { useCallback, useContext, useEffect, useRef } from "react";
import styles from "./JournalEntry.less";
import { SurfaceEditorContext } from "./SurfaceEditorContext";

interface JournalEntryProps {
  entryKey: string;
}

export const JournalEntry: React.FC<JournalEntryProps> = ({
  entryKey,
}: JournalEntryProps) => {
  const { entryEditorStates, setEntryEditorState, setEntryEditorRef } =
    useContext(SurfaceEditorContext);

  const editorState = entryEditorStates.get(entryKey);

  const editorRef = useRef<Editor>();

  // We listen for clicks on Surface to move the focus to the end of the Editor,
  // this is a hacky way of overriding that if the click is on the Editor
  // itself.
  useEffect(() => {
    editorRef.current.editor.onclick = (e) => {
      e.stopPropagation();
    };
    setEntryEditorRef(entryKey, editorRef);
  }, [editorRef, entryKey, setEntryEditorRef]);

  const handleKeyCommand = useCallback(
    (command: string, editorState: EditorState, eventTimeStamp: number) => {
      const newState = RichUtils.handleKeyCommand(editorState, command);
      if (newState) {
        setEntryEditorState(entryKey, newState);
        return "handled";
      } else return "not-handled";
    },
    [entryKey, setEntryEditorState]
  );

  const onEditorChange = useCallback(() => {}, []);

  return (
    <div className={styles["journal-entry"]}>
      <h1>header</h1>
      <Editor
        editorState={editorState}
        onChange={onEditorChange}
        handleKeyCommand={handleKeyCommand}
        ref={editorRef}
      ></Editor>
    </div>
  );
};
