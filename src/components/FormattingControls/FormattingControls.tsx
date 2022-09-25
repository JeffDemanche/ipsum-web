import React, { useCallback, useContext, useMemo } from "react";
import styles from "./FormattingControls.less";
import { RichUtils } from "draft-js";
import { ToggleStyleButton } from "../Buttons/ToggleStyleButton";
import { SurfaceEditorContext } from "../Surface/SurfaceEditorContext";

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
      <ToggleStyleButton
        label={<b>h1</b>}
        enabled={headerOneEnabled}
        onToggle={onHeaderClick}
      />
    </div>
  );
};
