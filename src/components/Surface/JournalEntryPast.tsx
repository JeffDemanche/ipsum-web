import { Divider, Typography } from "@mui/material";
import { decorator } from "components/Decorator/decorator";
import { Digest } from "components/Digest/Digest";
import { EditorState, RichUtils } from "draft-js";
import React, { useCallback, useContext } from "react";
import { IpsumDateTime } from "util/dates";
import { EditorWrapper } from "./EditorWrapper";
import styles from "./JournalEntry.less";
import { SurfaceEditorContext } from "./SurfaceEditorContext";
import { useJournalEntryEditor } from "./useJournalEntryEditor";

interface JournalEntryProps {
  entryKey: string;
  showDivider?: boolean;
}

export const JournalEntryPast: React.FC<JournalEntryProps> = ({
  entryKey,
  showDivider,
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

  const onEditorChange = useCallback(
    (newEditorState: EditorState) => {
      // This function prevents the content from being changed but allows
      // selection changes.
      if (
        editorState.getSelection().getHasFocus() &&
        newEditorState.getSelection().getHasFocus()
      ) {
        const onlySelectionChanges = EditorState.forceSelection(
          EditorState.createWithContent(
            editorState.getCurrentContent(),
            decorator
          ),
          newEditorState.getSelection()
        );
        setEntryEditorState(entryKey, () => onlySelectionChanges);
      } else {
        setEntryEditorState(entryKey, () => newEditorState);
      }
    },
    [editorState, entryKey, setEntryEditorState]
  );

  const onFocus = useCallback(() => {
    onEditorFocus(entryKey);
  }, [entryKey, onEditorFocus]);

  const onBlur = useCallback(() => {
    onEditorBlur(entryKey);
  }, [entryKey, onEditorBlur]);

  return (
    <div className={styles["journal-entry"]}>
      <div className={styles["entry-text-vertical"]}>
        <Typography
          variant="h3"
          color={(theme) => theme.palette.onSurfaceHighEmphasis}
        >
          {IpsumDateTime.fromString(entryKey, "entry-printed-date").toString(
            "entry-printed-date-nice"
          )}
        </Typography>
        {editorState && (
          <EditorWrapper
            enableControls={false}
            editorKey={entryKey}
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
        {showDivider && (
          <div className={styles["divider-container"]}>
            <Divider></Divider>
          </div>
        )}
      </div>
      {editorState && (
        <div className={styles["digest-wrapper"]}>
          <Digest entryKey={entryKey} />
        </div>
      )}
    </div>
  );
};
