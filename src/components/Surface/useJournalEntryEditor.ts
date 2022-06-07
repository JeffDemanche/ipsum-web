import { ContentBlock, ContentState, Editor, EditorState } from "draft-js";
import { useContext, useEffect, useMemo, useRef, useState } from "react";
import styles from "./JournalEntry.less";
import { parseContentState } from "util/content-state";
import { SurfaceEditorContext } from "./SurfaceEditorContext";
import { InMemoryStateContext } from "state/in-memory/InMemoryStateProvider";

interface UseJournalEntryEditorArgs {
  entryKey: string;
}

interface UseJournalEntryEditorResult {
  editorRef: React.MutableRefObject<Editor>;
  editorState: EditorState;
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
  const { state } = useContext(InMemoryStateContext);

  const contentState = useMemo(
    () =>
      state && state.entries[entryKey]
        ? parseContentState(state.entries[entryKey].contentState)
        : ContentState.createFromText(""),
    [state, entryKey]
  );

  const {
    registerEditor,
    setEntryEditorState,
    unregisterEditor,
    entryEditorStates,
  } = useContext(SurfaceEditorContext);

  const editorState = entryEditorStates.get(entryKey);

  const editorRef = useRef<Editor>();

  const empty = !editorState?.getCurrentContent().hasText();

  useEffect(() => {
    registerEditor(entryKey, undefined, editorRef);
    return () => {
      unregisterEditor(entryKey);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // This approach makes sure we only set the editor state to the stored entry
  // value once per component render.
  const [hasFilledEntryFromState, setHasFilledEntryFromState] = useState(false);
  useEffect(() => {
    if (!hasFilledEntryFromState) {
      setEntryEditorState(entryKey, () => {
        return EditorState.createWithContent(contentState);
      });
      setHasFilledEntryFromState(true);
    }
  }, [contentState, entryKey, hasFilledEntryFromState, setEntryEditorState]);

  return {
    editorRef,
    editorState,
    empty,
    blockStyleFn,
  };
};
