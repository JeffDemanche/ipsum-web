import { Editor, EditorState, RichUtils } from "draft-js";
import React, { useCallback, useContext } from "react";
import { EditorWrapper } from "./EditorWrapper";
import styles from "./JournalEntry.less";
import { SurfaceEditorContext } from "./SurfaceEditorContext";
import { useJournalEntryEditor } from "./useJournalEntryEditor";

interface JournalEntryProps {
  entryKey: string;
}

export const JournalEntryPast: React.FC<JournalEntryProps> = ({
  entryKey,
}: JournalEntryProps) => {
  const { editorRef, editorState, blockStyleFn } = useJournalEntryEditor({
    entryKey,
  });

  const { setEntryEditorState, onEditorFocus, onEditorBlur } =
    useContext(SurfaceEditorContext);

  // We listen for clicks on Surface to move the focus to the end of the Editor,
  // this is a hacky way of overriding that if the click is on the Editor
  // itself.
  // useEffect(() => {
  //   editorRef.current.editor.onclick = (e) => {
  //     e.stopPropagation();
  //   };
  //   setEntryEditorRef(entryKey, editorRef);
  // }, [editorRef, entryKey, setEntryEditorRef]);

  const handleKeyCommand = useCallback(
    (command: string, editorState: EditorState) => {
      const newState = RichUtils.handleKeyCommand(editorState, command);
      if (newState) {
        setEntryEditorState(entryKey, newState);
        return "handled";
      } else return "not-handled";
    },
    [entryKey, setEntryEditorState]
  );

  const onEditorChange = useCallback(() => {}, []);

  const onFocus = useCallback(() => {
    onEditorFocus(entryKey);
  }, [entryKey, onEditorFocus]);

  const onBlur = useCallback(() => {
    onEditorBlur(entryKey);
  }, [entryKey, onEditorBlur]);

  return (
    <div className={styles["journal-entry"]}>
      <h1>{entryKey}</h1>
      {editorState && (
        <EditorWrapper
          enableHighlights={true}
          editorState={editorState}
          onChange={onEditorChange}
          onFocus={onFocus}
          onBlur={onBlur}
          handleKeyCommand={handleKeyCommand}
          blockStyleFn={blockStyleFn}
          ref={editorRef}
        ></EditorWrapper>
      )}
    </div>
  );
};
