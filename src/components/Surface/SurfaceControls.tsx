import React, { useCallback } from "react";
import styles from "./SurfaceControls.less";
import { EditorState, RichUtils } from "draft-js";
import { ToggleStyleButton } from "../Buttons/ToggleStyleButton";

interface SurfaceControlsProps {
  editorState: EditorState;
  setEditorState: React.Dispatch<React.SetStateAction<EditorState>>;
}

export const SurfaceControls: React.FC<SurfaceControlsProps> = ({
  editorState,
  setEditorState,
}: SurfaceControlsProps) => {
  const onBoldClick = useCallback(() => {
    setEditorState(RichUtils.toggleInlineStyle(editorState, "BOLD"));
  }, [editorState]);

  const onItalicClick = useCallback(() => {
    setEditorState(RichUtils.toggleInlineStyle(editorState, "ITALIC"));
  }, [editorState]);

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
