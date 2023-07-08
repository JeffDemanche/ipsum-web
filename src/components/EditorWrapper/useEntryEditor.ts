import { ContentState, Editor, EditorState } from "draft-js";
import { useContext, useEffect, useMemo, useRef } from "react";
import { parseContentState, stringifyContentState } from "util/content-state";
import { EditorContext, EditorMetadata } from "./EditorContext";
import { decorator } from "components/Decorator";
import { gql } from "util/apollo";
import { useQuery } from "@apollo/client";

interface UseEntryEditorArgs {
  entryKey: string;
  metadata: EditorMetadata;
}

interface UseEntryEditorResult {
  editorRef: React.MutableRefObject<Editor>;
  editorState: EditorState;
  empty: boolean;
}

const UseJournalEntryEditorQuery = gql(`
  query UseJournalEntryEditor($entryKey: ID!) {
    entry(entryKey: $entryKey) {
      entryKey
      contentState
    }
  }
`);

/**
 * Provides common React functionality to use between both the JournalEntryToday
 * component and the JournalEntryPast component.
 */
export const useEntryEditor = ({
  entryKey,
  metadata,
}: UseEntryEditorArgs): UseEntryEditorResult => {
  const {
    data: { entry },
  } = useQuery(UseJournalEntryEditorQuery, {
    variables: { entryKey },
  });

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
  } = useContext(EditorContext);

  const editorState = entryEditorStates.get(entryKey);
  const editorMetadata = entryEditorMetadatas.get(entryKey);
  const editorRef = useRef<Editor>();

  const empty = !editorState?.getCurrentContent().hasText();

  useEffect(() => {
    registerEditor(entryKey, undefined, editorRef, metadata);
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
  };
};
