import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { MenuItem, Select, ToggleButton } from "@mui/material";
import {
  $createParagraphNode,
  $getSelection,
  $isRangeSelection,
  COMMAND_PRIORITY_LOW,
  FORMAT_TEXT_COMMAND,
  LexicalEditor,
  RangeSelection,
  SELECTION_CHANGE_COMMAND,
} from "lexical";
import { $getNearestNodeOfType, mergeRegister } from "@lexical/utils";
import {
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
  REMOVE_LIST_COMMAND,
  $isListNode,
  ListNode,
} from "@lexical/list";
import { $isLinkNode } from "@lexical/link";
import { $isAtNodeEnd, $setBlocksType } from "@lexical/selection";
import {
  $isHeadingNode,
  $createQuoteNode,
  $createHeadingNode,
} from "@lexical/rich-text";
import React, { useCallback, useEffect, useRef, useState } from "react";
import styles from "./ToolbarPlugin.less";
import {
  FormatBold,
  FormatItalic,
  FormatStrikethrough,
  FormatUnderlined,
} from "@mui/icons-material";

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

const supportedBlockTypes = new Set([
  "paragraph",
  "quote",
  "code",
  "h1",
  "h2",
  "ul",
  "ol",
]);

const blockTypeToBlockName: Record<string, string> = {
  code: "Code Block",
  h1: "Large Heading",
  h2: "Small Heading",
  h3: "Heading",
  h4: "Heading",
  h5: "Heading",
  ol: "Numbered List",
  paragraph: "Normal",
  quote: "Quote",
  ul: "Bulleted List",
};

export const ToolbarPlugin: React.FunctionComponent = () => {
  const [editor] = useLexicalComposerContext();

  const toolbarRef = useRef<HTMLDivElement>(null);

  const [selectedElementKey, setSelectedElementKey] = useState(null);

  const [blockType, setBlockType] = useState("paragraph");

  const [isLink, setIsLink] = useState(false);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isStrikethrough, setIsStrikethrough] = useState(false);

  const updateToolbar = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      const anchorNode = selection.anchor.getNode();
      const element =
        anchorNode.getKey() === "root"
          ? anchorNode
          : anchorNode.getTopLevelElementOrThrow();
      const elementKey = element.getKey();
      const elementDOM = editor.getElementByKey(elementKey);
      if (elementDOM !== null) {
        setSelectedElementKey(elementKey);
        if ($isListNode(element)) {
          const parentList = $getNearestNodeOfType(anchorNode, ListNode);
          const type = parentList ? parentList.getTag() : element.getTag();
          setBlockType(type);
        } else {
          const type = $isHeadingNode(element)
            ? element.getTag()
            : element.getType();
          setBlockType(type);
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

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          updateToolbar();
        });
      }),
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        (_payload, newEditor) => {
          updateToolbar();
          return false;
        },
        COMMAND_PRIORITY_LOW
      )
    );
  }, [editor, updateToolbar]);

  const formatParagraph = () => {
    if (blockType !== "paragraph") {
      editor.update(() => {
        const selection = $getSelection();

        if ($isRangeSelection(selection)) {
          $setBlocksType(selection, () => $createParagraphNode());
        }
      });
    }
  };

  const formatLargeHeading = () => {
    if (blockType !== "h1") {
      editor.update(() => {
        const selection = $getSelection();

        if ($isRangeSelection(selection)) {
          $setBlocksType(selection, () => $createHeadingNode("h1"));
        }
      });
    }
  };

  const formatSmallHeading = () => {
    if (blockType !== "h2") {
      editor.update(() => {
        const selection = $getSelection();

        if ($isRangeSelection(selection)) {
          $setBlocksType(selection, () => $createHeadingNode("h2"));
        }
      });
    }
  };

  const formatBulletList = () => {
    if (blockType !== "ul") {
      editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, null);
    } else {
      editor.dispatchCommand(REMOVE_LIST_COMMAND, null);
    }
  };

  const formatNumberedList = () => {
    if (blockType !== "ol") {
      editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, null);
    } else {
      editor.dispatchCommand(REMOVE_LIST_COMMAND, null);
    }
  };

  const formatQuote = () => {
    if (blockType !== "quote") {
      editor.update(() => {
        const selection = $getSelection();

        if ($isRangeSelection(selection)) {
          $setBlocksType(selection, () => $createQuoteNode());
        }
      });
    }
  };

  return (
    <div className={styles["toolbar"]} ref={toolbarRef}>
      <ToggleButton
        className={styles["inline-format-button"]}
        value="check"
        selected={isBold}
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold");
        }}
      >
        <FormatBold />
      </ToggleButton>
      <ToggleButton
        className={styles["inline-format-button"]}
        value="check"
        selected={isItalic}
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic");
        }}
      >
        <FormatItalic />
      </ToggleButton>
      <ToggleButton
        className={styles["inline-format-button"]}
        value="check"
        selected={isUnderline}
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline");
        }}
      >
        <FormatUnderlined />
      </ToggleButton>
      <ToggleButton
        className={styles["inline-format-button"]}
        value="check"
        selected={isStrikethrough}
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, "strikethrough");
        }}
      >
        <FormatStrikethrough />
      </ToggleButton>
      {
        <Select
          value={blockType}
          className={styles["block-format-select"]}
          aria-label="Formatting Options"
        >
          <MenuItem
            value={"paragraph"}
            key={"paragraph"}
            selected={blockType === "paragraph"}
            onClick={formatParagraph}
          >
            <span></span>
            <span>Normal</span>
          </MenuItem>
          <MenuItem
            value={"h1"}
            key={"h1"}
            selected={blockType === "h1"}
            onClick={formatLargeHeading}
          >
            <span>Large Heading</span>
          </MenuItem>
          <MenuItem
            value={"h2"}
            key={"h2"}
            selected={blockType === "h2"}
            onClick={formatSmallHeading}
          >
            <span>Small Heading</span>
          </MenuItem>
          <MenuItem
            value={"ul"}
            key={"ul"}
            selected={blockType === "ul"}
            onClick={formatBulletList}
          >
            <span>Bullet List</span>
          </MenuItem>
          <MenuItem
            value={"ol"}
            key={"ol"}
            selected={blockType === "ol"}
            onClick={formatNumberedList}
          >
            <span className="text">Numbered List</span>
          </MenuItem>
          <MenuItem
            value={"quote"}
            key={"quote"}
            selected={blockType === "quote"}
            onClick={formatQuote}
          >
            <span className="text">Quote</span>
          </MenuItem>
        </Select>
      }
    </div>
  );
};
