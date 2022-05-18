import { ContentState, Editor, EditorState } from "draft-js";
import React, { useCallback, useState } from "react";

const noop = () => {};

type EditorStateMap = ReadonlyMap<string, EditorState>;

type EditorRefMap = ReadonlyMap<string, React.MutableRefObject<Editor>>;

interface SurfaceEditorContextValue {
  focusedEditorKey: string | undefined;
  onEditorFocus: (editorKey: string) => void;
  onEditorBlur: (editorKey: string) => void;

  /**
   * For an editorKey, registers it on this context so it can be manipulated
   * outside of its containing component.
   */
  registerEditor: (
    editorKey: string,
    contentState: ContentState,
    editorRef: React.MutableRefObject<Editor>
  ) => void;

  /**
   * Unregisters an editor, probably from a React cleanup function.
   */
  unregisterEditor: (editorKey: string) => void;

  /**
   * Maps entry keys (dates, probably) to the DraftJS editor state for them.
   */
  entryEditorStates: EditorStateMap;
  setEntryEditorState: (
    entryKey: string,
    setEditorState: (previousEditorState: EditorState) => EditorState
  ) => void;

  /**
   * Maps entry keys to a React ref of the DraftJS editor for them.
   */
  entryEditorRefs: EditorRefMap;
  setEntryEditorRef: (
    entryKey: string,
    ref: React.MutableRefObject<Editor>
  ) => void;
}

export const emptySurfaceEditorContextValue: SurfaceEditorContextValue = {
  focusedEditorKey: undefined,
  onEditorFocus: noop,
  onEditorBlur: noop,

  registerEditor: noop,
  unregisterEditor: noop,

  entryEditorStates: new Map<string, EditorState>(),
  setEntryEditorState: noop,
  entryEditorRefs: new Map<string, React.MutableRefObject<Editor>>(),
  setEntryEditorRef: noop,
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
  const [focusedEditorKey, setFocusedEditorKey] = useState(undefined);

  const onEditorFocus = useCallback((editorKey: string) => {
    setFocusedEditorKey(editorKey);
  }, []);

  const onEditorBlur = useCallback(
    (editorKey: string) => {
      if (focusedEditorKey === editorKey) {
        setFocusedEditorKey(undefined);
      }
    },
    [focusedEditorKey]
  );

  const [entryEditorStates, setEntryEditorStates] = useState<
    ReadonlyMap<string, EditorState>
  >(new Map());

  const [entryEditorRefs, setEntryEditorRefs] = useState<
    ReadonlyMap<string, React.MutableRefObject<Editor>>
  >(new Map());

  const setEntryEditorState = useCallback(
    (
      entryKey: string,
      setEditorState: (previousEditorState: EditorState) => EditorState
    ) => {
      setEntryEditorStates((prevEntryEditorStates) => {
        const editorsCopy = new Map(prevEntryEditorStates);
        editorsCopy.set(entryKey, setEditorState(editorsCopy.get(entryKey)));
        return editorsCopy;
      });
    },
    []
  );

  const setEntryEditorRef = useCallback(
    (entryKey: string, ref: React.MutableRefObject<Editor>) => {
      setEntryEditorRefs((prevRefs) => {
        const refsCopy = new Map(prevRefs);

        refsCopy.set(entryKey, ref);
        return refsCopy;
      });
    },
    []
  );

  const registerEditor = useCallback(
    (
      entryKey: string,
      contentState: ContentState,
      editorRef: React.MutableRefObject<Editor>
    ) => {
      if (entryEditorStates.has(entryKey) || entryEditorRefs.has(entryKey)) {
        console.error("Tried to register editor that was already registered");
        return;
      } else {
        setEntryEditorState(entryKey, () =>
          contentState
            ? EditorState.createWithContent(contentState)
            : EditorState.createEmpty()
        );
        setEntryEditorRef(entryKey, editorRef);
      }
    },
    [entryEditorRefs, entryEditorStates, setEntryEditorRef, setEntryEditorState]
  );

  const unregisterEditor = useCallback(
    (entryKey: string) => {
      const editorsCopy = new Map(entryEditorStates);
      editorsCopy.delete(entryKey);
      setEntryEditorStates(editorsCopy);

      const editorRefsCopy = new Map(entryEditorRefs);
      editorRefsCopy.delete(entryKey);
      setEntryEditorRefs(editorRefsCopy);
    },
    [entryEditorRefs, entryEditorStates]
  );

  return (
    <SurfaceEditorContext.Provider
      value={{
        focusedEditorKey,
        onEditorFocus,
        onEditorBlur,

        registerEditor,
        unregisterEditor,

        entryEditorStates,
        setEntryEditorState,
        entryEditorRefs,
        setEntryEditorRef,
      }}
    >
      {children}
    </SurfaceEditorContext.Provider>
  );
};
