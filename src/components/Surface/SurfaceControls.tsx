import React, { useCallback, useContext } from "react";
import styles from "./SurfaceControls.less";
import { RichUtils } from "draft-js";
import { ToggleStyleButton } from "../Buttons/ToggleStyleButton";
import { SurfaceEditorContext } from "./SurfaceEditorContext";

export const SurfaceControls = () => {
  const { focusedEditorKey, setEntryEditorState } =
    useContext(SurfaceEditorContext);

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
      <ToggleStyleButton label={<b>b</b>} onToggle={onBoldClick} />
      <ToggleStyleButton label={<i>i</i>} onToggle={onItalicClick} />
    </div>
  );
};
