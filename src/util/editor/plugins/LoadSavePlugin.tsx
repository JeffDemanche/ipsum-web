import React, { useEffect } from "react";
import { useDebouncedCallback } from "util/hooks";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { $generateHtmlFromNodes, $generateNodesFromDOM } from "@lexical/html";
import { $getRoot, EditorState, LexicalEditor } from "lexical";
import { IpsumEditorMetadata } from "../IpsumEditor";
import {
  createArcEntry,
  createJournalEntry,
  deleteArcEntry,
  deleteJournalEntry,
  EntryType,
  gql,
  updateEntry,
} from "util/apollo";
import { ContentState } from "draft-js";
import { stringifyContentState } from "util/content-state";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useQuery } from "@apollo/client";

interface LoadSavePluginProps {
  timeout?: number;
  entryKey: string;
  metadata: IpsumEditorMetadata;
}

const IpsumEditorQuery = gql(`
  query IpsumEditor($entryKey: ID!) {
    entry(entryKey: $entryKey) {
      entryKey
      htmlString
      entryType
    }
  }
`);

export const LoadSavePlugin: React.FunctionComponent<LoadSavePluginProps> = ({
  timeout = 500,
  entryKey,
  metadata,
}) => {
  const { data } = useQuery(IpsumEditorQuery, { variables: { entryKey } });

  const htmlString = data?.entry?.htmlString ?? "";

  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    editor.update(() => {
      const parser = new DOMParser();
      const dom = parser.parseFromString(htmlString, "text/html");

      const nodes = $generateNodesFromDOM(editor, dom);

      const root = $getRoot();
      root.clear();

      nodes.forEach((node) => {
        root.append(node);
      });
    });
  }, []);

  const debouncedOnChange = useDebouncedCallback(
    (editorState: EditorState, editor: LexicalEditor, tags: Set<string>) => {
      editor.getEditorState().read(() => {
        const htmlString = $generateHtmlFromNodes(editor, null);

        const root = $getRoot();
        const isEmpty =
          root.getFirstChild()?.isEmpty() && root.getChildrenSize() === 1;

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
