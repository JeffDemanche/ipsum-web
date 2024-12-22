import { $isLinkNode } from "@lexical/link";
import {
  $isListNode,
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
  ListNode,
  REMOVE_LIST_COMMAND,
} from "@lexical/list";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  $createHeadingNode,
  $createQuoteNode,
  $isHeadingNode,
} from "@lexical/rich-text";
import { $isAtNodeEnd, $setBlocksType } from "@lexical/selection";
import { $getNearestNodeOfType, mergeRegister } from "@lexical/utils";
import type { BlockType } from "components/atoms/EntryEditor";
import type {
  FormattableEditor} from "components/molecules/FormattingControls";
import {
  FormattingControlsContext,
} from "components/molecules/FormattingControls";
import type {
  ElementNode,
  RangeSelection,
  TextNode} from "lexical";
import {
  $createParagraphNode,
  $getSelection,
  $isRangeSelection,
  BLUR_COMMAND,
  COMMAND_PRIORITY_LOW,
  FOCUS_COMMAND,
  FORMAT_TEXT_COMMAND,
  SELECTION_CHANGE_COMMAND
} from "lexical";
import type React from "react";
import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { CREATE_HIGHLIGHT_ASSIGNMENT_COMMAND } from "./HighlightAssignmentPlugin";
import { $isIpsumCommentNode } from "./IpsumCommentNode";

function getSelectedNode(selection: RangeSelection) {
  const anchor = selection.anchor;
  const focus = selection.focus;
  const anchorNode = selection.anchor.getNode();
  const focusNode = selection.focus.getNode();
  if (anchorNode === focusNode) {
    return anchorNode;
  }
  const isBackward = selection.isBackward();
  if (isBackward) {
    return $isAtNodeEnd(focus) ? anchorNode : focusNode;
  } else {
    return $isAtNodeEnd(anchor) ? focusNode : anchorNode;
  }
}

interface FormattingPluginProps {
  /**
   * @returns ID of created highlight.
   */
  createHighlight?: () => string;
}

export const FormattingPlugin: React.FunctionComponent<
  FormattingPluginProps
> = ({ createHighlight }) => {
  const { setActiveEditor } = useContext(FormattingControlsContext);
  const [editor] = useLexicalComposerContext();

  const [editorFocused, setEditorFocused] = useState(false);

  const [selectedElementKey, setSelectedElementKey] = useState(null);

  const [blockType, setBlockType] = useState<BlockType>("paragraph");

  const [link, setIsLink] = useState(false);
  const [bold, setIsBold] = useState(false);
  const [italic, setIsItalic] = useState(false);
  const [underline, setIsUnderline] = useState(false);
  const [strikethrough, setIsStrikethrough] = useState(false);

  const getFirstBlockParent = (node: TextNode | ElementNode) => {
    let parent = node.getParent();
    while (parent && parent.getType() !== "root") {
      if (!parent.isInline()) {
        return parent;
      }
      parent = parent.getParent();
    }
    return null;
  };

  const updateFormattingState = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      const anchorNode = selection.anchor.getNode();
      const element =
        anchorNode.getKey() === "root"
          ? anchorNode
          : getFirstBlockParent(anchorNode);
      const elementKey = element?.getKey();
      const elementDOM = editor.getElementByKey(elementKey);
      if (elementKey && elementDOM !== null) {
        setSelectedElementKey(elementKey);
        if ($isListNode(element)) {
          const parentList = $getNearestNodeOfType(anchorNode, ListNode);
          const type = parentList ? parentList.getTag() : element.getTag();
          setBlockType(type);
        } else {
          const type = $isHeadingNode(element)
            ? element.getTag()
            : element.getType();
          if (type !== "root") setBlockType(type as BlockType);
        }
      }
      // Update text format
      setIsBold(selection.hasFormat("bold"));
      setIsItalic(selection.hasFormat("italic"));
      setIsUnderline(selection.hasFormat("underline"));
      setIsStrikethrough(selection.hasFormat("strikethrough"));

      // Update links
      const node = getSelectedNode(selection);
      const parent = node.getParent();
      if ($isLinkNode(parent) || $isLinkNode(node)) {
        setIsLink(true);
      } else {
        setIsLink(false);
      }
    }
  }, [editor]);

  const formattableEditor: FormattableEditor = useMemo(
    () => ({
      isFocused: editorFocused,
      restoreFocus: () => {
        editor.focus();
      },
      bold,
      setBold: () => {
        editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold");
      },
      italic,
      setItalic: () => {
        editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic");
      },
      underline,
      setUnderline: () => {
        editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline");
      },
      strikethrough,
      setStrikethrough: () => {
        editor.dispatchCommand(FORMAT_TEXT_COMMAND, "strikethrough");
      },
      link: false,
      setLink: () => {},
      blockType,
      setBlockType: (type) => {
        switch (type) {
          case "paragraph":
            editor.update(() => {
              const selection = $getSelection();

              if ($isRangeSelection(selection)) {
                $setBlocksType(selection, () => $createParagraphNode());
              }
            });
            break;
          case "h1":
            editor.update(() => {
              const selection = $getSelection();

              if ($isRangeSelection(selection)) {
                $setBlocksType(selection, () => $createHeadingNode("h1"));
              }
            });
            break;
          case "h2":
            editor.update(() => {
              const selection = $getSelection();

              if ($isRangeSelection(selection)) {
                $setBlocksType(selection, () => $createHeadingNode("h2"));
              }
            });
            break;
          case "ul":
            if (blockType !== "ul") {
              editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, null);
            } else {
              editor.dispatchCommand(REMOVE_LIST_COMMAND, null);
            }
            break;
          case "ol":
            if (blockType !== "ol") {
              editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, null);
            } else {
              editor.dispatchCommand(REMOVE_LIST_COMMAND, null);
            }
            break;
          case "quote":
            editor.update(() => {
              const selection = $getSelection();

              if ($isRangeSelection(selection)) {
                $setBlocksType(selection, () => $createQuoteNode());
              }
            });
            break;
        }
      },
      createHighlight: () => {
        const highlightId = createHighlight?.();

        if (!highlightId) {
          return;
        }

        editor.update(() => {
          editor.dispatchCommand(CREATE_HIGHLIGHT_ASSIGNMENT_COMMAND, {
            highlightId,
          });
        });
      },
    }),
    [
      blockType,
      bold,
      createHighlight,
      editor,
      editorFocused,
      italic,
      strikethrough,
      underline,
    ]
  );

  useEffect(() => {
    setActiveEditor?.(formattableEditor);
  }, [formattableEditor, setActiveEditor]);

  useEffect(() => {
    mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          updateFormattingState();
        });
      }),
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        () => {
          updateFormattingState();
          return false;
        },
        COMMAND_PRIORITY_LOW
      )
    );
  }, [editor, formattableEditor, setActiveEditor, updateFormattingState]);

  useEffect(() => {
    editor.registerCommand(
      BLUR_COMMAND,
      () => {
        setEditorFocused(false);
        return false;
      },
      COMMAND_PRIORITY_LOW
    );
    editor.registerCommand(
      FOCUS_COMMAND,
      () => {
        setEditorFocused(true);
        return false;
      },
      COMMAND_PRIORITY_LOW
    );
  }, [editor, formattableEditor, setActiveEditor, updateFormattingState]);

  return null;
};
