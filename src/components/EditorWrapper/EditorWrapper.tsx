import { Editor, EditorProps, EditorState } from "draft-js";
import React, { useEffect, useMemo, useState } from "react";
import { TextRangeHighlight } from "components/EditorSelection";
import { FormattingControls } from "components/FormattingControls";
import styles from "./EditorWrapper.less";
import { IpsumSelectionState } from "util/selection";

interface EditorWrapperProps {
  enableControls: boolean;
  enableHighlights: boolean;
  editorState: EditorState;
  editorRef: React.RefObject<Editor>;
  setEditorState: React.Dispatch<React.SetStateAction<EditorState>>;
}

type EditorWrapperPropsCombined = EditorWrapperProps &
  EditorProps & { ref: React.Ref<Editor> };

export const EditorWrapper: React.FC<EditorWrapperPropsCombined> =
  React.forwardRef<Editor, EditorWrapperPropsCombined>((props, ref) => {
    const editorSelection = useMemo(
      () =>
        new IpsumSelectionState(
          props.editorState.getSelection(),
          IpsumSelectionState.rangeFromDocument(),
          props.editorRef
        ),
      [props.editorRef, props.editorState]
    );

    // editorSelection will become an empty selection as soon as the user
    // interacts with the popper. This state persists the selection until the
    // user explicitly performs an action that should close the popper.
    const [persistentSelection, setPersistentState] = useState(() =>
      editorSelection?.clone()
    );

    useEffect(() => {
      if (
        editorSelection &&
        (editorSelection.isNonEmpty() || editorSelection.isContained())
      ) {
        setPersistentState(editorSelection.clone());
      }
    }, [editorSelection]);

    return (
      <div className={styles["editor-wrapper-container"]}>
        {props.enableControls && (
          <FormattingControls
            editorState={props.editorState}
            setEditorState={props.setEditorState}
          />
        )}
        <Editor {...props} ref={ref}></Editor>
        <TextRangeHighlight
          editorRef={props.editorRef}
          editorState={props.editorState}
          editorKey={props.editorKey}
          selection={persistentSelection}
          onClickAway={() => {
            setPersistentState(editorSelection?.clone());
          }}
        ></TextRangeHighlight>
      </div>
    );
  });

EditorWrapper.displayName = "EditorWrapper";
