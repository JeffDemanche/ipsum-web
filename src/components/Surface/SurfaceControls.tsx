import React, { useCallback, useContext, useMemo } from "react";
import styles from "./SurfaceControls.less";
import { RichUtils } from "draft-js";
import { ToggleStyleButton } from "../Buttons/ToggleStyleButton";
import { SurfaceEditorContext } from "./SurfaceEditorContext";

export const SurfaceControls = () => {
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

  const onSurfaceControlsClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
  }, []);

  return (
    <div
      className={styles["surface-controls"]}
      onClick={onSurfaceControlsClick}
    >
      <ToggleStyleButton
        label={<b>b</b>}
        enabled={boldEnabled}
        onToggle={onBoldClick}
      />
      <ToggleStyleButton
        label={<i>i</i>}
        enabled={italicEnabled}
        onToggle={onItalicClick}
      />
    </div>
  );
};
