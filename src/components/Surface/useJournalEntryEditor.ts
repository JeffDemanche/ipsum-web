import { ContentBlock, ContentState, Editor, EditorState } from "draft-js";
import { useContext, useEffect, useMemo, useRef, useState } from "react";
import styles from "./JournalEntry.less";
import { parseContentState } from "util/content-state";
import { SurfaceEditorContext } from "./SurfaceEditorContext";
import { InMemoryStateContext } from "components/InMemoryStateContext/InMemoryStateContext";
import cx from "classnames";
import { decorator } from "components/Decorator/decorator";

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
  return cx(styles["editor-block"], {
    [styles["editor-paragraph"]]: block.getType() === "unstyled",
    [styles["editor-header-one"]]: block.getType() === "header-one",
  });
};

/**
 * Provides common React functionality to use between both the JournalEntryToday
 * component and the JournalEntryPast component.
 */
export const useJournalEntryEditor = ({
  entryKey,
}: UseJournalEntryEditorArgs): UseJournalEntryEditorResult => {
  const { state, shouldReloadEditor } = useContext(InMemoryStateContext);

  const contentStateFromState = useMemo(
    () =>
      state && state.entries[entryKey]
        ? parseContentState(state.entries[entryKey].contentState)
        : ContentState.createFromText(""),
    [state, entryKey]
  );

  const {
    registerEditor,
    setEntryEditorState,
    setEntryEditorMetadata,
    unregisterEditor,
    entryEditorStates,
    entryEditorMetadatas,
  } = useContext(SurfaceEditorContext);

  const editorState = entryEditorStates.get(entryKey);
  const editorMetadata = entryEditorMetadatas.get(entryKey);
  const editorRef = useRef<Editor>();

  const empty = !editorState?.getCurrentContent().hasText();

  useEffect(() => {
    registerEditor(entryKey, undefined, editorRef);
    return () => {
      unregisterEditor(entryKey);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);
  useEffect(() => {
    if (editorMetadata && (!hasLoadedOnce || shouldReloadEditor)) {
      // Occurs when a syncedWithState is set to false, triggering a re-load.
      setEntryEditorState(entryKey, () => {
        return EditorState.createWithContent(contentStateFromState, decorator);
      });
      setEntryEditorMetadata(entryKey, {
        ...editorMetadata,
        syncedWithState: true,
      });
      setHasLoadedOnce(true);
    }
  }, [
    contentStateFromState,
    editorMetadata,
    entryKey,
    hasLoadedOnce,
    shouldReloadEditor,
    setEntryEditorMetadata,
    setEntryEditorState,
  ]);

  return {
    editorRef,
    editorState,
    empty,
    blockStyleFn,
  };
};
