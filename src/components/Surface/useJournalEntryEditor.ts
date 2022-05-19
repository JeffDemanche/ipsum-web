import { ContentBlock, Editor, EditorState } from "draft-js";
import { useContext, useEffect, useRef } from "react";
import styles from "./JournalEntry.less";
import { Entry } from "state/JournalState.types";
import { JournalStateContext } from "state/JournalStateContext";
import { usePrevious } from "util/hooks/usePrevious";
import { SurfaceEditorContext } from "./SurfaceEditorContext";

interface UseJournalEntryEditorArgs {
  entryKey: string;
}

interface UseJournalEntryEditorResult {
  entry: Entry;
  editorRef: React.MutableRefObject<Editor>;
  editorState: EditorState;
  loading: boolean;
  changesSaved: boolean;
  empty: boolean;
  blockStyleFn: (block: ContentBlock) => string;
}

const blockStyleFn = (block: ContentBlock) => {
  if (block.getType() === "unstyled") return styles["editor-paragraph"];
};

/**
 * Provides common React functionality to use between both the JournalEntryToday
 * component and the JournalEntryPast component.
 */
export const useJournalEntryEditor = ({
  entryKey,
}: UseJournalEntryEditorArgs): UseJournalEntryEditorResult => {
  const { loadEntry, unloadEntry, loadedEntries } =
    useContext(JournalStateContext);

  const entry = loadedEntries.get(entryKey);

  const prevEntry = usePrevious(entry);

  const {
    registerEditor,
    setEntryEditorState,
    unregisterEditor,
    entryEditorStates,
  } = useContext(SurfaceEditorContext);

  const editorState = entryEditorStates.get(entryKey);

  const editorRef = useRef<Editor>();

  const loading = !entry;

  const changesSaved = entry?.contentState
    .getBlockMap()
    .equals(editorState?.getCurrentContent().getBlockMap());

  const empty = !editorState?.getCurrentContent().hasText();

  useEffect(() => {
    loadEntry(entryKey);
    registerEditor(entryKey, undefined, editorRef);
    return () => {
      unloadEntry(entryKey);
      unregisterEditor(entryKey);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // The side effect of the entry becoming defined for the first time is to
    // replace the content in the editor. This shouldn't happen on subsequent
    // updates to the entry state (see changesSaved above).
    if (entry && !prevEntry) {
      setEntryEditorState(entryKey, () => {
        return EditorState.createWithContent(entry.contentState);
      });
    }
  }, [entry, entryKey, prevEntry, setEntryEditorState]);

  return {
    entry,
    editorRef,
    editorState,
    loading,
    changesSaved,
    empty,
    blockStyleFn,
  };
};
