import React, { useCallback, useContext, useEffect, useRef } from "react";
import cx from "classnames";
import { Editor, EditorState } from "draft-js";
import { getCurrentLocalDay } from "util/dates";
import styles from "./JournalEntry.less";
import { SurfaceEditorContext } from "./SurfaceEditorContext";
import { JournalStateContext } from "state/JournalStateContext";
import { usePrevious } from "util/hooks/usePrevious";

interface JournalEntryTodayProps {
  entryKey: string;
}

/**
 * This renders an empty journal entry, with a date and placeholder text.
 */
export const JournalEntryToday: React.FC<JournalEntryTodayProps> = ({
  entryKey,
}: JournalEntryTodayProps) => {
  const { loadEntry, unloadEntry, loadedEntries, createOrUpdateEntry } =
    useContext(JournalStateContext);

  //
  const entry = loadedEntries.get(entryKey);
  const prevEntry = usePrevious(entry);

  const {
    registerEditor,
    setEntryEditorState,
    unregisterEditor,
    entryEditorStates,
  } = useContext(SurfaceEditorContext);

  const editorState = entryEditorStates.get(entryKey);

  const editorRef = useRef();

  const today = getCurrentLocalDay();

  const empty = !editorState?.getCurrentContent().hasText();

  const changesSaved = entry?.contentState
    .getBlockMap()
    .equals(editorState?.getCurrentContent().getBlockMap());

  const loading = !entry;

  useEffect(() => {
    loadEntry(today);
    registerEditor(entry?.date ?? today, undefined, editorRef);
    return () => {
      unloadEntry(today);
      unregisterEditor(entry?.date ?? today);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // The side effect of the entry becoming defined for the first time is to
    // replace the content in the editor. This shouldn't happen on subsequent
    // updates to the entry state (see changesSaved above).
    if (entry && !prevEntry) {
      setEntryEditorState(entryKey, () =>
        EditorState.createWithContent(entry.contentState)
      );
    }
  }, [entry, entryKey, prevEntry, setEntryEditorState]);

  const onEditorChange = useCallback(
    (newEditorState: EditorState) => {
      if (newEditorState) {
        createOrUpdateEntry(today, newEditorState.getCurrentContent());
        setEntryEditorState(entryKey, () => newEditorState);
      }
    },
    [createOrUpdateEntry, entryKey, setEntryEditorState, today]
  );

  return (
    <div className={styles["journal-entry"]}>
      <h1 className={cx({ [styles["empty-entry"]]: empty })}>{today}</h1>
      {editorState && (
        <Editor
          editorState={editorState}
          onChange={onEditorChange}
          ref={editorRef}
        ></Editor>
      )}
    </div>
  );
};
