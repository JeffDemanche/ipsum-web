import { ContentBlock, ContentState, Editor, EditorState } from "draft-js";
import { useContext, useEffect, useMemo, useRef } from "react";
import editorStyes from "./EditorStyles.less";
import { parseContentState, stringifyContentState } from "util/content-state";
import { DailyJournalEditorContext } from "./DailyJournalEditorContext";
import cx from "classnames";
import { decorator } from "components/Decorator";
import { useStateDocumentQuery, Document } from "state/in-memory";

interface UseJournalEntryEditorArgs {
  entryKey: string;
}

interface UseJournalEntryEditorResult {
  editorRef: React.MutableRefObject<Editor>;
  editorState: EditorState;
  empty: boolean;
  blockStyleFn: (block: ContentBlock) => string;
  entry: Document<"entry">;
}

const blockStyleFn = (block: ContentBlock) => {
  return cx(editorStyes["editor-block"], {
    [editorStyes["editor-paragraph"]]: block.getType() === "unstyled",
    [editorStyes["editor-header-one"]]: block.getType() === "header-one",
    [editorStyes["editor-unordered-list-item"]]:
      block.getType() === "unordered-list-item",
    [editorStyes["editor-ordered-list-item"]]:
      block.getType() === "ordered-list-item",
    [editorStyes["editor-blockquote"]]: block.getType() === "blockquote",
  });
};

/**
 * Provides common React functionality to use between both the JournalEntryToday
 * component and the JournalEntryPast component.
 */
export const useJournalEntryEditor = ({
  entryKey,
}: UseJournalEntryEditorArgs): UseJournalEntryEditorResult => {
  const { data: entryObj } = useStateDocumentQuery({
    collection: "entry",
    keys: [entryKey],
  });

  const entry = entryObj[entryKey];

  const contentStateFromState = useMemo(
    () =>
      entry
        ? parseContentState(entry.contentState)
        : ContentState.createFromText(""),
    [entry]
  );

  const {
    focusedEditorKey,
    registerEditor,
    setEntryEditorState,
    setEntryEditorMetadata,
    unregisterEditor,
    entryEditorStates,
    entryEditorMetadatas,
  } = useContext(DailyJournalEditorContext);

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

  useEffect(() => {
    if (
      focusedEditorKey !== entryKey &&
      stringifyContentState(contentStateFromState) !==
        stringifyContentState(editorState?.getCurrentContent())
    ) {
      setEntryEditorState(entryKey, () => {
        return EditorState.createWithContent(contentStateFromState, decorator);
      });
      setEntryEditorMetadata(entryKey, {
        ...editorMetadata,
        syncedWithState: true,
      });
    }
  }, [
    contentStateFromState,
    editorMetadata,
    editorState,
    entry,
    entryKey,
    focusedEditorKey,
    setEntryEditorMetadata,
    setEntryEditorState,
  ]);

  return {
    editorRef,
    editorState,
    empty,
    blockStyleFn,
    entry,
  };
};
