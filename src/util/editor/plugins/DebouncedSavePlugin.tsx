import React from "react";
import { useDebouncedCallback } from "util/hooks";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { $generateHtmlFromNodes } from "@lexical/html";
import { $getRoot, EditorState, LexicalEditor } from "lexical";
import { IpsumEditorMetadata } from "../IpsumEditor";
import {
  createArcEntry,
  createJournalEntry,
  deleteArcEntry,
  deleteJournalEntry,
  EntryType,
  updateEntry,
} from "util/apollo";
import { ContentState } from "draft-js";
import { stringifyContentState } from "util/content-state";

interface DebouncedSavePluginProps {
  timeout?: number;
  entryKey: string;
  metadata: IpsumEditorMetadata;
}

export const DebouncedSavePlugin: React.FunctionComponent<
  DebouncedSavePluginProps
> = ({ timeout = 500, entryKey, metadata }) => {
  const debouncedOnChange = useDebouncedCallback(
    (editorState: EditorState, editor: LexicalEditor, tags: Set<string>) => {
      editor.getEditorState().read(() => {
        const htmlString = $generateHtmlFromNodes(editor, null);

        const root = $getRoot();
        const isEmpty =
          root.getFirstChild().isEmpty() && root.getChildrenSize() === 1;

        if (isEmpty) {
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
            stringifiedContentState: stringifyContentState(
              ContentState.createFromText("")
            ),
            htmlString,
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
      });
    },
    timeout
  );

  return <OnChangePlugin onChange={debouncedOnChange} />;
};
