import { useQuery } from "@apollo/client";
import { $generateHtmlFromNodes, $generateNodesFromDOM } from "@lexical/html";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { $getRoot, EditorState, LexicalEditor } from "lexical";
import React, { useEffect, useRef } from "react";
import { gql } from "util/apollo";
import { useDebouncedCallback } from "util/hooks";

import { IpsumEditorMetadata } from "../IpsumEditor";

interface LoadSavePluginProps {
  timeout?: number;
  entryKey: string | undefined;
  setEntryKey: (entryKey: string | undefined) => void;

  createEntry?: (htmlString: string) => string;
  updateEntry?: ({
    entryKey,
    htmlString,
  }: {
    entryKey: string;
    htmlString: string;
  }) => boolean;
  deleteEntry?: (entryKey: string) => void;

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
  setEntryKey,
  createEntry,
  updateEntry,
  deleteEntry,
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
        const isEmpty = root.isEmpty() || root.getChildrenSize() === 1;

        if (isEmpty) {
          deleteEntry?.(entryKey);
          setEntryKey?.(undefined);
        } else {
          const entry = {
            entryKey,
            htmlString,
            entryType: metadata.entryType,
          };
          const entryUpdateFailed = !entryKey || !updateEntry(entry);
          if (entryUpdateFailed && !isEmpty) {
            const newEntryKey = createEntry?.(htmlString);
            setEntryKey?.(newEntryKey);
          }
        }
      });
    },
    timeout
  );

  return <OnChangePlugin onChange={debouncedOnChange} />;
};
