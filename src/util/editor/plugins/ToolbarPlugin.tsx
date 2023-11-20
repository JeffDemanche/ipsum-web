import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { MenuItem, Select, ToggleButton } from "@mui/material";
import {
  $createParagraphNode,
  $getSelection,
  $isRangeSelection,
  COMMAND_PRIORITY_LOW,
  FORMAT_TEXT_COMMAND,
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
import { ArcChooser } from "./ArcChooser";
import { HighlightButton } from "./HighlightButton";

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

interface ToolbarPluginProps {
  entryKey: string;
}

export const ToolbarPlugin: React.FunctionComponent<ToolbarPluginProps> = ({
  entryKey,
}) => {
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
        aria-label="bold"
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
        aria-label="italic"
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
        aria-label="underline"
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
        aria-label="strikethrough"
        value="check"
        selected={isStrikethrough}
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, "strikethrough");
        }}
      >
        <FormatStrikethrough />
      </ToggleButton>
      <Select
        value={blockType}
        variant="outlined"
        className={styles["block-format-select"]}
        aria-label="Formatting Options"
      >
        <MenuItem
          className={styles["menu-item"]}
          value={"paragraph"}
          key={"paragraph"}
          selected={blockType === "paragraph"}
          onClick={formatParagraph}
        >
          <i className="bi bi-text-paragraph"></i>
          <span>Normal</span>
        </MenuItem>
        <MenuItem
          className={styles["menu-item"]}
          value={"h1"}
          key={"h1"}
          selected={blockType === "h1"}
          onClick={formatLargeHeading}
        >
          <i className="bi bi-type-h1"></i>
          <span>Large Heading</span>
        </MenuItem>
        <MenuItem
          className={styles["menu-item"]}
          value={"h2"}
          key={"h2"}
          selected={blockType === "h2"}
          onClick={formatSmallHeading}
        >
          <i className="bi bi-type-h2"></i>
          <span>Small Heading</span>
        </MenuItem>
        <MenuItem
          className={styles["menu-item"]}
          value={"ul"}
          key={"ul"}
          selected={blockType === "ul"}
          onClick={formatBulletList}
        >
          <i className="bi bi-list-task"></i>
          <span>Bullet List</span>
        </MenuItem>
        <MenuItem
          className={styles["menu-item"]}
          value={"ol"}
          key={"ol"}
          selected={blockType === "ol"}
          onClick={formatNumberedList}
        >
          <i className="bi bi-list-ol"></i>
          <span className="text">Numbered List</span>
        </MenuItem>
        <MenuItem
          className={styles["menu-item"]}
          value={"quote"}
          key={"quote"}
          selected={blockType === "quote"}
          onClick={formatQuote}
        >
          <i className="bi bi-blockquote-left"></i>
          <span className="text">Quote</span>
        </MenuItem>
      </Select>
      <HighlightButton entryKey={entryKey}></HighlightButton>
      {/* <ArcChooser entryKey={entryKey} editor={editor} /> */}
    </div>
  );
};
