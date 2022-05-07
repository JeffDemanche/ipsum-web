import {
  convertFromRaw,
  Editor,
  EditorState,
  RawDraftContentState,
} from "draft-js";
import React, { useCallback, useEffect, useRef, useState } from "react";

const noop = () => {};

interface SurfaceEditorContextValue {
  editorState: EditorState;
  setEditorState: React.Dispatch<React.SetStateAction<EditorState>>;
  domEditorRef: React.MutableRefObject<Editor>;

  moveFocusToEnd: () => void;
}

export const emptySurfaceEditorContextValue: SurfaceEditorContextValue = {
  editorState: null,
  setEditorState: noop,
  domEditorRef: null,

  moveFocusToEnd: noop,
};

export const SurfaceEditorContext = React.createContext(
  emptySurfaceEditorContextValue
);

interface SurfaceEditorContextProviderProps {
  children: React.ReactChild;
}

export const SurfaceEditorContextProvider: React.FC<
  SurfaceEditorContextProviderProps
> = ({ children }: SurfaceEditorContextProviderProps) => {
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );

  // https://draftjs.org/docs/api-reference-content-state/
  const contentState = editorState.getCurrentContent();

  // https://draftjs.org/docs/api-reference-selection-state
  const selectionState = editorState.getSelection();

  useEffect(() => {
    const rawContent: RawDraftContentState = {
      blocks: [
        {
          key: "todays-date",
          depth: 0,
          text: "TEST",
          type: "header-1",
          inlineStyleRanges: [],
          entityRanges: [{ offset: 0, length: 4, key: 0 }],
        },
      ],
      entityMap: {
        0: {
          type: "TOKEN",
          mutability: "IMMUTABLE",
          data: {},
        },
      },
    };

    const blocks = convertFromRaw(rawContent);

    setEditorState(EditorState.createWithContent(blocks));
  }, []);

  console.log(editorState.toJS());

  const domEditorRef = useRef<Editor>();

  const moveFocusToEnd = useCallback(() => {
    setEditorState(EditorState.moveFocusToEnd(editorState));
  }, [editorState]);

  return (
    <SurfaceEditorContext.Provider
      value={{
        editorState,
        setEditorState,
        domEditorRef,
        moveFocusToEnd,
      }}
    >
      {children}
    </SurfaceEditorContext.Provider>
  );
};
