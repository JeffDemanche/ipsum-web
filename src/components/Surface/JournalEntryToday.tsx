import { Divider, Typography } from "@mui/material";
import cx from "classnames";
import { Digest } from "components/Digest/Digest";
import { DraftEditorCommand, EditorState, RichUtils } from "draft-js";
import React, { useCallback, useContext } from "react";
import { useApiAction } from "state/api/use-api-action";
import _ from "underscore";
import { stringifyContentState } from "util/content-state";
import { IpsumDateTime } from "util/dates";
import { EditorWrapper } from "./EditorWrapper";
import styles from "./JournalEntry.less";
import { SurfaceEditorContext } from "./SurfaceEditorContext";
import { useJournalEntryEditor } from "./useJournalEntryEditor";

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
  const { editorRef, editorState, empty, blockStyleFn } = useJournalEntryEditor(
    { entryKey }
  );

  const { setEntryEditorState, onEditorFocus, onEditorBlur } =
    useContext(SurfaceEditorContext);

  const { act: deleteEntry } = useApiAction<"deleteEntry">({
    name: "deleteEntry",
  });
  const { act: createOrUpdateEntry } = useApiAction<"createOrUpdateEntry">({
    name: "createOrUpdateEntry",
  });

  const onEditorUpdate = (newEditorState: EditorState) => {
    if (newEditorState) {
      if (empty) {
        deleteEntry({ entryKey });
      } else {
        createOrUpdateEntry({
          entryKey,
          date: IpsumDateTime.fromString(entryKey, "entry-printed-date"),
          contentState: stringifyContentState(
            newEditorState.getCurrentContent()
          ),
        });
      }
    }
  };

  // Ignore deps warning because eslint can't handle the debouncing.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const onEditorUpdateDebounced = useCallback(_.debounce(onEditorUpdate, 500), [
    empty,
    entryKey,
  ]);

  const onEditorChange = useCallback(
    (newEditorState: EditorState) => {
      setEntryEditorState(entryKey, () => newEditorState);
      onEditorUpdateDebounced(newEditorState);
    },
    [entryKey, onEditorUpdateDebounced, setEntryEditorState]
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
      <Typography
        variant="h4"
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
      {editorState && (
        <>
          <EditorWrapper
            placeholder="Tell a story to your future..."
            editorKey={entryKey}
            enableHighlights={true}
            onFocus={onFocus}
            onBlur={onBlur}
            editorState={editorState}
            handleKeyCommand={handleKeyCommand}
            blockStyleFn={blockStyleFn}
            onChange={onEditorChange}
            ref={editorRef}
          ></EditorWrapper>
          <div className={styles["digest-wrapper"]}>
            <Digest entryKey={entryKey} />
          </div>
        </>
      )}
      {showDivider && <Divider></Divider>}
    </div>
  );
};
