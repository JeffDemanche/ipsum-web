import { Editor } from "draft-js";
import React, { useCallback, useState } from "react";
import { useDateString } from "util/dates";

const noop = () => {};

type EditorRefMap = ReadonlyMap<string, React.MutableRefObject<Editor>>;

interface EditorContextValue {
  focusedEditorKey: string | undefined;
  onEditorFocus: (editorKey: string) => void;
  onEditorBlur: (editorKey: string) => void;

  todayEntryKey: string;

  /**
   * Maps entry keys to a React ref of the DraftJS editor for them.
   */
  entryEditorRefs: EditorRefMap;
  setEntryEditorRef: (
    entryKey: string,
    ref: React.MutableRefObject<Editor>
  ) => void;
}

export const emptyEditorContextValue: EditorContextValue = {
  focusedEditorKey: undefined,
  onEditorFocus: noop,
  onEditorBlur: noop,

  todayEntryKey: "",

  entryEditorRefs: new Map<string, React.MutableRefObject<Editor>>(),
  setEntryEditorRef: noop,
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

  const [entryEditorRefs, setEntryEditorRefs] = useState<
    ReadonlyMap<string, React.MutableRefObject<Editor>>
  >(new Map());

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

  return (
    <EditorContext.Provider
      value={{
        focusedEditorKey,
        onEditorFocus,
        onEditorBlur,

        todayEntryKey,

        entryEditorRefs,
        setEntryEditorRef,
      }}
    >
      {children}
    </EditorContext.Provider>
  );
};
