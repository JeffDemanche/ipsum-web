import React, { useEffect, useRef } from "react";
import { useDebouncedCallback } from "util/hooks";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { $generateHtmlFromNodes, $generateNodesFromDOM } from "@lexical/html";
import { $getRoot, EditorState, LexicalEditor } from "lexical";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";

interface LoadSavePluginProps {
  timeout?: number;
  entryKey: string | undefined;
  initialHtmlString?: string;
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
}

export const LoadSavePlugin: React.FunctionComponent<LoadSavePluginProps> = ({
  timeout = 500,
  entryKey,
  initialHtmlString,
  setEntryKey,
  createEntry,
  updateEntry,
  deleteEntry,
}) => {
  const [editor] = useLexicalComposerContext();

  const skipNextUpdate = useRef(false);

  useEffect(() => {
    if (skipNextUpdate.current) return;

    skipNextUpdate.current = false;

    editor.update(() => {
      const parser = new DOMParser();
      const dom = parser.parseFromString(initialHtmlString, "text/html");

      const nodes = initialHtmlString
        ? $generateNodesFromDOM(editor, dom)
        : undefined;

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
  }, [editor, initialHtmlString]);

  const debouncedOnChange = useDebouncedCallback(
    (editorState: EditorState, editor: LexicalEditor, tags: Set<string>) => {
      skipNextUpdate.current = true;
      editor.getEditorState().read(() => {
        const htmlString = $generateHtmlFromNodes(editor, null);

        const root = $getRoot();
        const isEmpty =
          root.isEmpty() ||
          (root.getFirstChild()?.isEmpty() && root.getChildrenSize() === 1);

        if (isEmpty) {
          deleteEntry?.(entryKey);
          setEntryKey?.(undefined);
        } else {
          const entry = {
            entryKey,
            htmlString,
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
