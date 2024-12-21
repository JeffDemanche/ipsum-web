import { $generateHtmlFromNodes, $generateNodesFromDOM } from "@lexical/html";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { $getRoot, $setSelection, EditorState, LexicalEditor } from "lexical";
import React, { useEffect, useRef } from "react";
import { useDebouncedCallback } from "util/hooks";

interface EntryStatePluginProps {
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

export const EntryStatePlugin: React.FunctionComponent<
  EntryStatePluginProps
> = ({
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

  const editorFocused = useRef(false);

  const onBlur = () => {
    skipNextUpdate.current = false;
    editorFocused.current = false;
  };

  const onFocus = () => {
    editorFocused.current = true;
  };

  useEffect(() => {
    const contentEditable = editor.getRootElement();

    contentEditable.addEventListener("blur", onBlur);
    contentEditable.addEventListener("focus", onFocus);

    return () => {
      contentEditable.removeEventListener("blur", onBlur);
      contentEditable.removeEventListener("focus", onFocus);
    };
  }, [editor]);

  // This is where we handle deciding whether to overwrite the editor's content,
  // and then do so.
  useEffect(() => {
    if (skipNextUpdate.current) {
      skipNextUpdate.current = false;
      return;
    }

    skipNextUpdate.current = false;

    editor.update(
      () => {
        const parser = new DOMParser();
        const dom = parser.parseFromString(initialHtmlString, "text/html");

        const nodes = initialHtmlString
          ? $generateNodesFromDOM(editor, dom)
          : undefined;

        if (!nodes) {
          return;
        } else {
          const root = $getRoot();
          root.clear();

          nodes.forEach((node) => {
            root.append(node);
          });

          if (!editorFocused.current) {
            // This prevents changes to unfocused editors stealing focus after
            // having their content updated.
            $setSelection(null);
          }
        }
      }
      // { discrete: true }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editor, initialHtmlString]);

  // This is where we fire callbacks that ultimately manipulate the entry state.
  const debouncedOnChange = useDebouncedCallback(
    (editorState: EditorState, editor: LexicalEditor, tags: Set<string>) => {
      // Prevent changes to unfocused editors causing loops. The general
      // prinicple is that only the active editor should be able to fire API
      // changes.
      if (!editorFocused.current) {
        return;
      }

      skipNextUpdate.current = true;
      editor.getEditorState().read(() => {
        const htmlString = $generateHtmlFromNodes(editor, null);

        const root = $getRoot();
        const isEmpty = root.isEmpty() || root.getTextContent().trim() === "";

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
