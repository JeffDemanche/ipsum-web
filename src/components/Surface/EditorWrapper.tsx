import { Editor, EditorProps } from "draft-js";
import React, { useContext, useEffect, useMemo, useState } from "react";
import { TextRangeHighlight } from "components/EditorSelection/TextRangeHighlight";
import { EditorSelectionContext } from "components/EditorSelection/EditorSelectionContext";

interface EditorWrapperProps {
  enableHighlights: boolean;
}

type EditorWrapperPropsCombined = EditorWrapperProps &
  EditorProps & { ref: React.Ref<Editor> };

export const EditorWrapper: React.FC<EditorWrapperPropsCombined> =
  React.forwardRef<Editor, EditorWrapperPropsCombined>((props, ref) => {
    const { getSelection } = useContext(EditorSelectionContext);

    const editorSelection = useMemo(
      () => getSelection(props.editorKey),
      [getSelection, props.editorKey]
    );

    // editorSelection will become an empty selection as soon as the user
    // interacts with the rotor popper. This state persists the selection until
    // the user explicitly performs an action that should close the popper.
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
      <div style={{ position: "relative" }}>
        <Editor {...props} ref={ref}></Editor>
        <TextRangeHighlight
          editorKey={props.editorKey}
          selection={persistentSelection}
          onClickAway={() => {
            setPersistentState(editorSelection.clone());
          }}
        ></TextRangeHighlight>
      </div>
    );
  });

EditorWrapper.displayName = "EditorWrapper";
