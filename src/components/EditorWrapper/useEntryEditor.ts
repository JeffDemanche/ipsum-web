import { ContentState, Editor, EditorState } from "draft-js";
import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { parseContentState, stringifyContentState } from "util/content-state";
import { EditorContext } from "./EditorContext";
import { decorator } from "components/Decorator";
import {
  createArcEntry,
  createJournalEntry,
  deleteArcEntry,
  deleteJournalEntry,
  EntryType,
  gql,
  updateEntry,
} from "util/apollo";
import { useQuery } from "@apollo/client";

interface EditorMetadataJournal {
  entryType: EntryType.Journal;
}

interface EditorMetadataArc {
  entryType: EntryType.Arc;
  arcId: string;
  arcName: string;
}

export type EditorMetadata = EditorMetadataJournal | EditorMetadataArc;

interface UseEntryEditorArgs {
  entryKey: string;
  metadata: EditorMetadata;
}

interface UseEntryEditorResult {
  editorRef: React.MutableRefObject<Editor>;
  editorState: EditorState;
  empty: boolean;
  setEditorState: React.Dispatch<React.SetStateAction<EditorState>>;
  saveEntry: ({
    entryKey,
    editorState,
  }: {
    entryKey: string;
    editorState?: EditorState;
  }) => void;
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

  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const editorRef = useRef<Editor>();

  const { focusedEditorKey } = useContext(EditorContext);

  const empty = !editorState?.getCurrentContent().hasText();

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
      const contentState =
        editorState?.getCurrentContent() ?? editorState.getCurrentContent();

      if (!contentState.hasText()) {
        switch (metadata.entryType) {
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
          entryType: metadata.entryType,
        };
        const attemptedUpdate = updateEntry(entry);
        if (!attemptedUpdate) {
          switch (metadata.entryType) {
            case EntryType.Journal:
              createJournalEntry(entry);
              break;
            case EntryType.Arc:
              createArcEntry({
                arcId: metadata.arcId,
                arcName: metadata.arcName,
              });
              break;
          }
        }
      }
    },
    [metadata]
  );

  useEffect(() => {
    if (
      focusedEditorKey !== entryKey &&
      stringifyContentState(contentStateFromState) !==
        stringifyContentState(editorState?.getCurrentContent())
    ) {
      setEditorState(() =>
        EditorState.createWithContent(contentStateFromState, decorator)
      );
    }
  }, [contentStateFromState, editorState, entry, entryKey, focusedEditorKey]);

  return {
    editorRef,
    editorState,
    empty,
    saveEntry,
    setEditorState,
  };
};
