import React, { useCallback, useContext } from "react";
import cx from "classnames";
import _ from "underscore";
import { DraftEditorCommand, Editor, EditorState, RichUtils } from "draft-js";
import styles from "./JournalEntry.less";
import { SurfaceEditorContext } from "./SurfaceEditorContext";
import { stringifyContentState } from "util/content-state";
import { useJournalEntryEditor } from "./useJournalEntryEditor";
import { InMemoryStateContext } from "state/in-memory/InMemoryStateProvider";
import { IpsumDateTime } from "util/dates";
import { SurfaceControls } from "./SurfaceControls";

interface JournalEntryTodayProps {
  entryKey: string;
}

/**
 * This renders an empty journal entry, with a date and placeholder text.
 */
export const JournalEntryToday: React.FC<JournalEntryTodayProps> = ({
  entryKey,
}: JournalEntryTodayProps) => {
  const { editorRef, editorState, empty, blockStyleFn } = useJournalEntryEditor(
    { entryKey }
  );

  const { setEntryEditorState, onEditorFocus, onEditorBlur } =
    useContext(SurfaceEditorContext);

  const { dispatch } = useContext(InMemoryStateContext);

  const saveEntry = (newEditorState: EditorState) => {
    if (newEditorState) {
      if (empty) {
        dispatch({ type: "DELETE-ENTRY", payload: { entryKey } });
      } else {
        dispatch({
          type: "CREATE-OR-UPDATE-ENTRY",
          payload: {
            entryKey,
            date: IpsumDateTime.fromString(entryKey, "entry-printed-date"),
            contentState: stringifyContentState(
              newEditorState.getCurrentContent()
            ),
          },
        });
      }
    }
  };

  // Ignore deps warning because eslint can't handle the debouncing.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const saveEntryDebounced = useCallback(_.debounce(saveEntry, 500), [
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
    (command: DraftEditorCommand, editorState: EditorState) => {
      const newState = RichUtils.handleKeyCommand(editorState, command);
      if (newState) {
        setEntryEditorState(entryKey, () => newState);
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

  const onHeaderClick = useCallback(() => {
    editorRef.current.focus();
  }, [editorRef]);

  return (
    <div className={styles["journal-entry"]}>
      <h1
        className={cx({ [styles["empty-entry"]]: empty })}
        onClick={onHeaderClick}
      >
        {entryKey}
      </h1>
      {editorState && (
        <>
          <SurfaceControls />
          <Editor
            onFocus={onFocus}
            onBlur={onBlur}
            editorState={editorState}
            handleKeyCommand={handleKeyCommand}
            blockStyleFn={blockStyleFn}
            onChange={onEditorChange}
            ref={editorRef}
          ></Editor>
        </>
      )}
    </div>
  );
};
