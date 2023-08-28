import cx from "classnames";
import { Digest } from "components/Digest";
import { DraftEditorCommand, EditorState, RichUtils } from "draft-js";
import React, { useCallback, useContext } from "react";
import { stringifyContentState } from "util/content-state";
import { IpsumDateTime, IpsumDay } from "util/dates";
import { useDebouncedCallback } from "util/hooks";
import { placeholderForDate } from "util/placeholders";
import { blockStyleFn, EditorWrapper } from "components/EditorWrapper";
import styles from "./JournalEntry.less";
import { EditorContext } from "../EditorWrapper/EditorContext";
import { useEntryEditor } from "../EditorWrapper/useEntryEditor";
import { Divider, Typography } from "@mui/material";
import { ReflectionAccordion } from "./ReflectionAccordion";
import { EntryType } from "util/apollo";

interface JournalEntryTodayProps {
  entryKey: string;
  showDivider?: boolean;
}

/**
 * This renders an empty journal entry, with a date and placeholder text.
 */
export const JournalEntryToday: React.FC<JournalEntryTodayProps> = ({
  entryKey,
  showDivider,
}: JournalEntryTodayProps) => {
  const { editorRef, editorState, empty, saveEntry, setEditorState } =
    useEntryEditor({
      entryKey,
      metadata: { entryType: EntryType.Journal },
    });

  const { onEditorFocus, onEditorBlur } = useContext(EditorContext);

  /**
   * Debounced so we only update the state once every so often while typing.
   */
  const onEditorUpdate = useDebouncedCallback((newEditorState: EditorState) => {
    // Check to see if anything changed. This happens to fix a bug where editors
    // wouldn't clear after initializing a new journal due to the debounce
    // delay.
    const changed =
      stringifyContentState(editorState.getCurrentContent()) !==
      stringifyContentState(newEditorState.getCurrentContent());

    if (newEditorState && changed) {
      saveEntry({ entryKey, editorState: newEditorState });
    }
  }, 500);

  const onEditorChange = useCallback(
    (newEditorState: EditorState) => {
      setEditorState(() => newEditorState);
      onEditorUpdate(newEditorState);
    },
    [onEditorUpdate, setEditorState]
  );

  const handleKeyCommand = useCallback(
    (command: DraftEditorCommand, editorState: EditorState) => {
      const newState = RichUtils.handleKeyCommand(editorState, command);
      if (newState) {
        setEditorState(newState);
        return "handled";
      } else return "not-handled";
    },
    [setEditorState]
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
      <div className={styles["entry-text-vertical"]}>
        <Typography
          variant="h3"
          color={(theme) =>
            empty
              ? theme.palette.onSurfaceDisabled
              : theme.palette.onSurfaceHighEmphasis
          }
          className={cx(styles["entry-heading"], {
            [styles["empty-entry"]]: empty,
          })}
          onClick={onHeaderClick}
        >
          {IpsumDateTime.fromString(entryKey, "entry-printed-date").toString(
            "entry-printed-date-nice"
          )}
        </Typography>
        <ReflectionAccordion
          day={IpsumDay.fromString(entryKey, "stored-day")}
        ></ReflectionAccordion>
        {editorState && (
          <>
            <Digest entryKey={entryKey} />
            <EditorWrapper
              enableControls
              placeholder={placeholderForDate(
                IpsumDateTime.fromString(entryKey, "entry-printed-date")
              )}
              editorKey={entryKey}
              enableHighlights={true}
              onFocus={onFocus}
              onBlur={onBlur}
              editorState={editorState}
              setEditorState={setEditorState}
              handleKeyCommand={handleKeyCommand}
              blockStyleFn={blockStyleFn}
              onChange={onEditorChange}
              ref={editorRef}
              editorRef={editorRef}
            ></EditorWrapper>
          </>
        )}
        {showDivider && (
          <div className={styles["divider-container"]}>
            <Divider></Divider>
          </div>
        )}
      </div>
    </div>
  );
};
