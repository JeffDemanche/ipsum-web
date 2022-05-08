import {
  convertFromRaw,
  Editor,
  EditorState,
  RawDraftContentState,
} from "draft-js";
import React, { useCallback, useEffect, useState } from "react";

const noop = () => {};

type EditorStateMap = ReadonlyMap<string, EditorState>;

type EditorRefMap = ReadonlyMap<string, React.MutableRefObject<Editor>>;

interface SurfaceEditorContextValue {
  focusedEditorKey: string | undefined;
  onEditorFocus: (editorKey: string) => void;
  onEditorBlur: (editorKey: string) => void;

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
      const editorsCopy = new Map(entryEditorStates);
      editorsCopy.set(entryKey, setEditorState(editorsCopy.get(entryKey)));
      setEntryEditorStates(editorsCopy);
    },
    [entryEditorStates]
  );

  const setEntryEditorRef = useCallback(
    (entryKey: string, ref: React.MutableRefObject<Editor>) => {
      const refsCopy = new Map(entryEditorRefs);
      refsCopy.set(entryKey, ref);
      setEntryEditorRefs(refsCopy);
    },
    [entryEditorRefs]
  );

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

  // const moveFocusToEnd = useCallback(() => {
  //   setEditorState(EditorState.moveFocusToEnd(editorState));
  // }, [editorState]);

  return (
    <SurfaceEditorContext.Provider
      value={{
        focusedEditorKey,
        onEditorFocus,
        onEditorBlur,

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
