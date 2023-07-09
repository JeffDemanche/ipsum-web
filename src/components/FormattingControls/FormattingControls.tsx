import React, { useCallback, useContext } from "react";
import styles from "./FormattingControls.less";
import { EditorState, RichUtils } from "draft-js";
import { EditorContext } from "components/EditorWrapper";
import { ToggleButton } from "@mui/material";

interface FormattingControlProps {
  editorState: EditorState;
  setEditorState: React.Dispatch<React.SetStateAction<EditorState>>;
}

export const FormattingControls: React.FunctionComponent<
  FormattingControlProps
> = ({ editorState, setEditorState }) => {
  const { focusedEditorKey, todayEntryKey } = useContext(EditorContext);

  const focusedEditorSelection = editorState?.getSelection();
  const blockType = editorState
    ?.getCurrentContent()
    .getBlockForKey(focusedEditorSelection?.getStartKey())
    .getType();

  const boldEnabled = !!editorState?.getCurrentInlineStyle().has("BOLD");

  const onBoldClick = useCallback(() => {
    todayEntryKey === focusedEditorKey &&
      setEditorState((previousEditorState) =>
        RichUtils.toggleInlineStyle(
          EditorState.forceSelection(
            previousEditorState,
            focusedEditorSelection
          ),
          "BOLD"
        )
      );
  }, [focusedEditorKey, focusedEditorSelection, setEditorState, todayEntryKey]);

  const italicEnabled = !!editorState?.getCurrentInlineStyle().has("ITALIC");

  const onItalicClick = useCallback(() => {
    todayEntryKey === focusedEditorKey &&
      setEditorState((previousEditorState) =>
        RichUtils.toggleInlineStyle(
          EditorState.forceSelection(
            previousEditorState,
            focusedEditorSelection
          ),
          "ITALIC"
        )
      );
  }, [focusedEditorKey, focusedEditorSelection, setEditorState, todayEntryKey]);

  const toggleBlockStyle = useCallback(
    (type: string) => {
      todayEntryKey === focusedEditorKey &&
        setEditorState((previousEditorState) =>
          RichUtils.toggleBlockType(
            EditorState.forceSelection(
              previousEditorState,
              focusedEditorSelection
            ),
            type
          )
        );
    },
    [focusedEditorKey, focusedEditorSelection, setEditorState, todayEntryKey]
  );

  const onDailyJournalControlsClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
  }, []);

  return (
    <div
      className={styles["daily-journal-controls"]}
      onClick={onDailyJournalControlsClick}
    >
      <ToggleButton
        value="check"
        className={styles["toggle-button"]}
        disabled={!focusedEditorKey}
        selected={boldEnabled}
        onChange={onBoldClick}
        onMouseDown={(e) => e.preventDefault()}
      >
        <b>b</b>
      </ToggleButton>
      <ToggleButton
        value="check"
        className={styles["toggle-button"]}
        disabled={!focusedEditorKey}
        selected={italicEnabled}
        onChange={onItalicClick}
        onMouseDown={(e) => e.preventDefault()}
      >
        <b>i</b>
      </ToggleButton>
      <ToggleButton
        value="check"
        className={styles["toggle-button"]}
        disabled={!focusedEditorKey}
        selected={blockType === "header-one"}
        onChange={() => toggleBlockStyle("header-one")}
        onMouseDown={(e) => e.preventDefault()}
      >
        <b>h1</b>
      </ToggleButton>
      <ToggleButton
        value="check"
        className={styles["toggle-button"]}
        disabled={!focusedEditorKey}
        selected={blockType === "unordered-list-item"}
        onChange={() => toggleBlockStyle("unordered-list-item")}
        onMouseDown={(e) => e.preventDefault()}
      >
        <b>ul</b>
      </ToggleButton>
      <ToggleButton
        value="check"
        className={styles["toggle-button"]}
        disabled={!focusedEditorKey}
        selected={blockType === "ordered-list-item"}
        onChange={() => toggleBlockStyle("ordered-list-item")}
        onMouseDown={(e) => e.preventDefault()}
      >
        <b>ol</b>
      </ToggleButton>
      <ToggleButton
        value="check"
        className={styles["toggle-button"]}
        disabled={!focusedEditorKey}
        selected={blockType === "blockquote"}
        onChange={() => toggleBlockStyle("blockquote")}
        onMouseDown={(e) => e.preventDefault()}
      >
        <b>qu</b>
      </ToggleButton>
    </div>
  );
};
