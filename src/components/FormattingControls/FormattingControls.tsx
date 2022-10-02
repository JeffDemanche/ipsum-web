import React, { useCallback, useContext, useMemo } from "react";
import styles from "./FormattingControls.less";
import { RichUtils } from "draft-js";
import { SurfaceEditorContext } from "../Surface/SurfaceEditorContext";
import { ToggleButton } from "@mui/material";

export const FormattingControls: React.FunctionComponent = () => {
  const { focusedEditorKey, setEntryEditorState, entryEditorStates } =
    useContext(SurfaceEditorContext);

  const focusedEditorState = useMemo(
    () => entryEditorStates.get(focusedEditorKey),
    [entryEditorStates, focusedEditorKey]
  );

  const boldEnabled = !!focusedEditorState?.getCurrentInlineStyle().has("BOLD");

  const italicEnabled = !!focusedEditorState
    ?.getCurrentInlineStyle()
    .has("ITALIC");

  const headerOneEnabled = !!focusedEditorState
    ?.getCurrentContent()
    .has("header-one");

  const onBoldClick = useCallback(() => {
    setEntryEditorState(focusedEditorKey, (previousEditorState) =>
      RichUtils.toggleInlineStyle(previousEditorState, "BOLD")
    );
  }, [focusedEditorKey, setEntryEditorState]);

  const onItalicClick = useCallback(() => {
    setEntryEditorState(focusedEditorKey, (previousEditorState) =>
      RichUtils.toggleInlineStyle(previousEditorState, "ITALIC")
    );
  }, [focusedEditorKey, setEntryEditorState]);

  const onHeaderClick = useCallback(() => {
    setEntryEditorState(focusedEditorKey, (previousEditorState) =>
      RichUtils.toggleBlockType(previousEditorState, "header-one")
    );
  }, [focusedEditorKey, setEntryEditorState]);

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
        selected={headerOneEnabled}
        onChange={onHeaderClick}
      >
        <b>h1</b>
      </ToggleButton>
    </div>
  );
};
