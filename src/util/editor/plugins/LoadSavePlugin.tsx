import React, { useEffect, useRef } from "react";
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

  const htmlString = data?.entry?.htmlString;

  const [editor] = useLexicalComposerContext();

  const skipNextUpdate = useRef(false);

  useEffect(() => {
    if (skipNextUpdate.current) return;

    skipNextUpdate.current = false;

    editor.update(() => {
      const parser = new DOMParser();
      const dom = parser.parseFromString(htmlString, "text/html");

      const nodes = htmlString ? $generateNodesFromDOM(editor, dom) : undefined;

      const root = $getRoot();
      root.clear();

      if (!nodes) {
        return;
      } else {
        nodes.forEach((node) => {
          root.append(node);
        });
      }
    });
  }, [editor, htmlString]);

  const debouncedOnChange = useDebouncedCallback(
    (editorState: EditorState, editor: LexicalEditor, tags: Set<string>) => {
      skipNextUpdate.current = true;
      editor.getEditorState().read(() => {
        const htmlString = $generateHtmlFromNodes(editor, null);

        const root = $getRoot();
        const isEmpty =
          root.getFirstChild()?.isEmpty() && root.getChildrenSize() === 1;

        if (isEmpty) {
          console.log("empty");
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
            htmlString,
            entryType: metadata.entryType,
          };
          const attemptedUpdate = updateEntry(entry);
          if (!attemptedUpdate && !isEmpty) {
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
