import React, { useCallback, useContext, useMemo } from "react";
import styles from "./FormattingControls.less";
import { EditorState, RichUtils } from "draft-js";
import { SurfaceEditorContext } from "../Surface/SurfaceEditorContext";
import { ToggleButton } from "@mui/material";

export const FormattingControls: React.FunctionComponent = () => {
  const { focusedEditorKey, setEntryEditorState, entryEditorStates } =
    useContext(SurfaceEditorContext);

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

  const italicEnabled = !!focusedEditorState
    ?.getCurrentInlineStyle()
    .has("ITALIC");

  const onBoldClick = useCallback(() => {
    setEntryEditorState(focusedEditorKey, (previousEditorState) =>
      RichUtils.toggleInlineStyle(
        EditorState.forceSelection(previousEditorState, focusedEditorSelection),
        "BOLD"
      )
    );
  }, [focusedEditorKey, focusedEditorSelection, setEntryEditorState]);

  const onItalicClick = useCallback(() => {
    setEntryEditorState(focusedEditorKey, (previousEditorState) =>
      RichUtils.toggleInlineStyle(
        EditorState.forceSelection(previousEditorState, focusedEditorSelection),
        "ITALIC"
      )
    );
  }, [focusedEditorKey, focusedEditorSelection, setEntryEditorState]);

  const toggleBlockStyle = useCallback(
    (type: string) => {
      setEntryEditorState(focusedEditorKey, (previousEditorState) =>
        RichUtils.toggleBlockType(
          EditorState.forceSelection(
            previousEditorState,
            focusedEditorSelection
          ),
          type
        )
      );
    },
    [focusedEditorKey, focusedEditorSelection, setEntryEditorState]
  );

  const onSurfaceControlsClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
  }, []);

  return (
    <div
      className={styles["surface-controls"]}
      onClick={onSurfaceControlsClick}
    >
      <ToggleButton
        value="check"
        className={styles["toggle-button"]}
        disabled={!focusedEditorKey}
        selected={boldEnabled}
        onChange={onBoldClick}
      >
        <b>b</b>
      </ToggleButton>
      <ToggleButton
        value="check"
        className={styles["toggle-button"]}
        disabled={!focusedEditorKey}
        selected={italicEnabled}
        onMouseDown={onItalicClick}
      >
        <b>i</b>
      </ToggleButton>
      <ToggleButton
        value="check"
        className={styles["toggle-button"]}
        disabled={!focusedEditorKey}
        selected={blockType === "header-one"}
        onChange={() => toggleBlockStyle("header-one")}
      >
        <b>h1</b>
      </ToggleButton>
      <ToggleButton
        value="check"
        className={styles["toggle-button"]}
        disabled={!focusedEditorKey}
        selected={blockType === "unordered-list-item"}
        onChange={() => toggleBlockStyle("unordered-list-item")}
      >
        <b>ul</b>
      </ToggleButton>
      <ToggleButton
        value="check"
        className={styles["toggle-button"]}
        disabled={!focusedEditorKey}
        selected={blockType === "ordered-list-item"}
        onChange={() => toggleBlockStyle("ordered-list-item")}
      >
        <b>ol</b>
      </ToggleButton>
      <ToggleButton
        value="check"
        className={styles["toggle-button"]}
        disabled={!focusedEditorKey}
        selected={blockType === "blockquote"}
        onChange={() => toggleBlockStyle("blockquote")}
      >
        <b>qu</b>
      </ToggleButton>
    </div>
  );
};
