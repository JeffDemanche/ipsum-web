import React, { useCallback, useContext, useMemo } from "react";
import styles from "./FormattingControls.less";
import { EditorState, RichUtils } from "draft-js";
import { DailyJournalEditorContext } from "components/DailyJournal";
import { ToggleButton } from "@mui/material";

export const FormattingControls: React.FunctionComponent = () => {
  const {
    focusedEditorKey,
    setEntryEditorState,
    entryEditorStates,
    todayEntryKey,
  } = useContext(DailyJournalEditorContext);

  const focusedEditorState = useMemo(
    () => entryEditorStates.get(focusedEditorKey),
    [entryEditorStates, focusedEditorKey]
  );
  const focusedEditorSelection = focusedEditorState?.getSelection();
  const blockType = focusedEditorState
    ?.getCurrentContent()
    .getBlockForKey(focusedEditorSelection?.getStartKey())
    .getType();

  const boldEnabled = !!focusedEditorState?.getCurrentInlineStyle().has("BOLD");

  const onBoldClick = useCallback(() => {
    todayEntryKey === focusedEditorKey &&
      setEntryEditorState(
        focusedEditorKey,
        (previousEditorState) =>
          RichUtils.toggleInlineStyle(
            EditorState.forceSelection(
              previousEditorState,
              focusedEditorSelection
            ),
            "BOLD"
          ),
        true
      );
  }, [
    focusedEditorKey,
    focusedEditorSelection,
    setEntryEditorState,
    todayEntryKey,
  ]);

  const italicEnabled = !!focusedEditorState
    ?.getCurrentInlineStyle()
    .has("ITALIC");

  const onItalicClick = useCallback(() => {
    todayEntryKey === focusedEditorKey &&
      setEntryEditorState(
        focusedEditorKey,
        (previousEditorState) =>
          RichUtils.toggleInlineStyle(
            EditorState.forceSelection(
              previousEditorState,
              focusedEditorSelection
            ),
            "ITALIC"
          ),
        true
      );
  }, [
    focusedEditorKey,
    focusedEditorSelection,
    setEntryEditorState,
    todayEntryKey,
  ]);

  const toggleBlockStyle = useCallback(
    (type: string) => {
      todayEntryKey === focusedEditorKey &&
        setEntryEditorState(
          focusedEditorKey,
          (previousEditorState) =>
            RichUtils.toggleBlockType(
              EditorState.forceSelection(
                previousEditorState,
                focusedEditorSelection
              ),
              type
            ),
          true
        );
    },
    [
      focusedEditorKey,
      focusedEditorSelection,
      setEntryEditorState,
      todayEntryKey,
    ]
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
