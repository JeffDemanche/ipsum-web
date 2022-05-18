import React, { useCallback, useContext } from "react";
import cx from "classnames";
import _ from "underscore";
import { Editor, EditorState, RichUtils } from "draft-js";
import styles from "./JournalEntry.less";
import { SurfaceEditorContext } from "./SurfaceEditorContext";
import { JournalStateContext } from "state/JournalStateContext";
import { useJournalEntryEditor } from "./useJournalEntryEditor";

interface JournalEntryTodayProps {
  entryKey: string;
}

/**
 * This renders an empty journal entry, with a date and placeholder text.
 */
export const JournalEntryToday: React.FC<JournalEntryTodayProps> = ({
  entryKey,
}: JournalEntryTodayProps) => {
  const { entry, editorRef, editorState, loading, changesSaved, empty } =
    useJournalEntryEditor({ entryKey });

  const { setEntryEditorState, onEditorFocus, onEditorBlur } =
    useContext(SurfaceEditorContext);
  const { createOrUpdateEntry, deleteEntry } = useContext(JournalStateContext);

  const saveEntry = (newEditorState: EditorState) => {
    if (newEditorState) {
      if (empty) {
        deleteEntry(entryKey);
      } else {
        createOrUpdateEntry(entryKey, newEditorState.getCurrentContent());
      }
    }
  };

  // Ignore deps warning because eslint can't handle the debouncing.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const saveEntryDebounced = useCallback(_.debounce(saveEntry, 500), [
    createOrUpdateEntry,
    empty,
    entryKey,
  ]);

  const onEditorChange = useCallback(
    (newEditorState: EditorState) => {
      setEntryEditorState(entryKey, () => newEditorState);
      saveEntryDebounced(newEditorState);
    },
    [entryKey, saveEntryDebounced, setEntryEditorState]
  );

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

  const onFocus = useCallback(() => {
    onEditorFocus(entryKey);
  }, [entryKey, onEditorFocus]);

  const onBlur = useCallback(() => {
    onEditorBlur(entryKey);
  }, [entryKey, onEditorBlur]);

  return (
    <div className={styles["journal-entry"]}>
      <h1 className={cx({ [styles["empty-entry"]]: empty })}>{entryKey}</h1>
      {editorState && (
        <Editor
          onFocus={onFocus}
          onBlur={onBlur}
          editorState={editorState}
          handleKeyCommand={handleKeyCommand}
          onChange={onEditorChange}
          ref={editorRef}
        ></Editor>
      )}
    </div>
  );
};
