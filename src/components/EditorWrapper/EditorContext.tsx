import { decorator } from "components/Decorator";
import { ContentState, Editor, EditorState } from "draft-js";
import React, { useCallback, useState } from "react";
import {
  createJournalEntry,
  deleteArc,
  deleteJournalEntry,
  EntryType,
  updateEntry,
  createArcEntry,
  deleteArcEntry,
} from "util/apollo";
import { stringifyContentState } from "util/content-state";
import { useDateString } from "util/dates";

const noop = () => {};

type EditorStateMap = ReadonlyMap<string, EditorState>;

type EditorRefMap = ReadonlyMap<string, React.MutableRefObject<Editor>>;

interface EditorMetadataJournal {
  entryType: EntryType.Journal;
}

interface EditorMetadataArc {
  entryType: EntryType.Arc;
  arcId: string;
  arcName: string;
}

export type EditorMetadata = EditorMetadataJournal | EditorMetadataArc;

type EditorMetadataMap = ReadonlyMap<string, EditorMetadata>;

interface EditorContextValue {
  focusedEditorKey: string | undefined;
  onEditorFocus: (editorKey: string) => void;
  onEditorBlur: (editorKey: string) => void;

  todayEntryKey: string;

  /**
   * For an editorKey, registers it on this context so it can be manipulated
   * outside of its containing component.
   */
  registerEditor: (
    editorKey: string,
    contentState: ContentState,
    editorRef: React.MutableRefObject<Editor>,
    metadata: EditorMetadata
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
    setEditorState: (previousEditorState: EditorState) => EditorState,
    save?: boolean
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

  saveEntry: (args: { entryKey: string; editorState?: EditorState }) => void;
}

export const emptyEditorContextValue: EditorContextValue = {
  focusedEditorKey: undefined,
  onEditorFocus: noop,
  onEditorBlur: noop,

  todayEntryKey: "",

  registerEditor: noop,
  unregisterEditor: noop,

  entryEditorStates: new Map<string, EditorState>(),
  setEntryEditorState: noop,
  entryEditorMetadatas: new Map<string, EditorMetadata>(),
  setEntryEditorMetadata: noop,
  entryEditorRefs: new Map<string, React.MutableRefObject<Editor>>(),
  setEntryEditorRef: noop,

  saveEntry: noop,
};

export const EditorContext = React.createContext(emptyEditorContextValue);

interface EditorContextProviderProps {
  children: React.ReactNode;
}

export const EditorContextProvider: React.FunctionComponent<
  EditorContextProviderProps
> = ({ children }: EditorContextProviderProps) => {
  const todayEntryKey = useDateString(30000, "entry-printed-date");

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

  /**
   * The optional editorState parameter will be used to update the Apollo state
   * if provided, otherwise we use the editor state from the context map. This
   * is useful to avoid debounce issues for saving while typing.
   */
  const saveEntry = useCallback(
    ({
      entryKey,
      editorState,
    }: {
      entryKey: string;
      editorState?: EditorState;
    }) => {
      const entryMetadata = entryEditorMetadatas.get(entryKey);

      const contentState =
        editorState?.getCurrentContent() ??
        entryEditorStates.get(entryKey).getCurrentContent();

      if (!contentState.hasText()) {
        switch (entryMetadata.entryType) {
          case EntryType.Journal:
            deleteJournalEntry({ entryKey });
            break;
          case EntryType.Arc:
            deleteArcEntry(entryKey);
            break;
        }
      } else {
        const entry = {
          entryKey,
          stringifiedContentState: stringifyContentState(contentState),
          entryType: EntryType.Journal,
        };
        const attemptedUpdate = updateEntry(entry);
        if (!attemptedUpdate) {
          switch (entryMetadata.entryType) {
            case EntryType.Journal:
              createJournalEntry(entry);
              break;
            case EntryType.Arc:
              createArcEntry({
                arcId: entryMetadata.arcId,
                arcName: entryMetadata.arcName,
              });
              break;
          }
        }
      }
    },
    [entryEditorMetadatas, entryEditorStates]
  );

  const setEntryEditorState = useCallback(
    (
      entryKey: string,
      setEditorState: (previousEditorState: EditorState) => EditorState,
      save = false
    ) => {
      setEntryEditorStates((prevEntryEditorStates) => {
        const editorsCopy = new Map(prevEntryEditorStates);
        const newEditorState = setEditorState(editorsCopy.get(entryKey));
        if (save) saveEntry({ entryKey, editorState: newEditorState });
        editorsCopy.set(entryKey, newEditorState);
        return editorsCopy;
      });
    },
    [saveEntry]
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
      editorRef: React.MutableRefObject<Editor>,
      metadata: EditorMetadata
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
        setEntryEditorMetadata(entryKey, metadata);
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
    <EditorContext.Provider
      value={{
        focusedEditorKey,
        onEditorFocus,
        onEditorBlur,

        todayEntryKey,

        registerEditor,
        unregisterEditor,

        entryEditorStates,
        setEntryEditorState,
        entryEditorMetadatas,
        setEntryEditorMetadata,
        entryEditorRefs,
        setEntryEditorRef,

        saveEntry,
      }}
    >
      {children}
    </EditorContext.Provider>
  );
};
