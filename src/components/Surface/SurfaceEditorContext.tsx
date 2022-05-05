import { Editor, EditorState } from "draft-js";
import React, { useRef, useState } from "react";

interface SurfaceEditorContextValue {
  editorState: EditorState;
  setEditorState: React.Dispatch<React.SetStateAction<EditorState>>;
  domEditorRef: React.MutableRefObject<Editor>;
}

export const emptySurfaceEditorContextValue: SurfaceEditorContextValue = {
  editorState: null,
  setEditorState: () => {},
  domEditorRef: null,
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

  const domEditorRef = useRef<Editor>();

  return (
    <SurfaceEditorContext.Provider
      value={{
        editorState,
        setEditorState,
        domEditorRef,
      }}
    >
      {children}
    </SurfaceEditorContext.Provider>
  );
};
