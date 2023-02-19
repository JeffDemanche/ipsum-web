import { decorator } from "components/Decorator/decorator";
import { ContentState, Editor, EditorState } from "draft-js";
import React, { useCallback, useState } from "react";

const noop = () => {};

type EditorStateMap = ReadonlyMap<string, EditorState>;

type EditorRefMap = ReadonlyMap<string, React.MutableRefObject<Editor>>;

// Just keep this around because I think it'll come in handy.
// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface EditorMetadata {}

type EditorMetadataMap = ReadonlyMap<string, EditorMetadata>;

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

  entryEditorMetadatas: EditorMetadataMap;
  setEntryEditorMetadata: (entryKey: string, metadata: EditorMetadata) => void;

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
  entryEditorMetadatas: new Map<string, EditorMetadata>(),
  setEntryEditorMetadata: noop,
  entryEditorRefs: new Map<string, React.MutableRefObject<Editor>>(),
  setEntryEditorRef: noop,
};

export const SurfaceEditorContext = React.createContext(
  emptySurfaceEditorContextValue
);

interface SurfaceEditorContextProviderProps {
  children: React.ReactNode;
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

  const [entryEditorMetadatas, setEntryEditorMetadatas] = useState<
    ReadonlyMap<string, EditorMetadata>
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

  const setEntryEditorMetadata = useCallback(
    (entryKey: string, metadata: EditorMetadata) => {
      setEntryEditorMetadatas((prevMetadatas) => {
        const editorsCopy = new Map(prevMetadatas);
        editorsCopy.set(entryKey, metadata);
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
            ? EditorState.createWithContent(contentState, decorator)
            : EditorState.createEmpty(decorator)
        );
        setEntryEditorMetadata(entryKey, { syncedWithState: false });
        setEntryEditorRef(entryKey, editorRef);
      }
    },
    [
      entryEditorRefs,
      entryEditorStates,
      setEntryEditorMetadata,
      setEntryEditorRef,
      setEntryEditorState,
    ]
  );

  const unregisterEditor = useCallback((entryKey: string) => {
    setEntryEditorStates((editors) => {
      const editorsCopy = new Map(editors);
      editorsCopy.delete(entryKey);
      return editorsCopy;
    });

    setEntryEditorMetadatas((metadatas) => {
      const metadatasCopy = new Map(metadatas);
      metadatasCopy.delete(entryKey);
      return metadatasCopy;
    });

    setEntryEditorRefs((refs) => {
      const refsCopy = new Map(refs);
      refsCopy.delete(entryKey);
      return refsCopy;
    });
  }, []);

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
        entryEditorMetadatas,
        setEntryEditorMetadata,
        entryEditorRefs,
        setEntryEditorRef,
      }}
    >
      {children}
    </SurfaceEditorContext.Provider>
  );
};
