import {
  FormatBold,
  FormatItalic,
  FormatStrikethrough,
  FormatUnderlined,
  Highlight,
} from "@mui/icons-material";
import { Button } from "components/atoms/Button";
import { MenuItem } from "components/atoms/MenuItem";
import { Select } from "components/atoms/Select";
import { ToggleButton } from "components/atoms/ToggleButton";
import React, { useContext, useEffect, useRef, useState } from "react";
import { TestIds } from "util/test-ids";

import styles from "./FormattingControls.less";
import { FormattingControlsContext } from "./FormattingControlsContext";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface FormattingControlsProps {}

export const FormattingControls: React.FunctionComponent<
  FormattingControlsProps
> = () => {
  const controlsContext = useContext(FormattingControlsContext);

  const controlsRef = useRef<HTMLDivElement>(null);
  const blockMenuRef = useRef<HTMLDivElement>(null);

  const { activeEditor } = controlsContext;

  const [focusedEditor, setFocusedEditor] = useState(false);

  const blurTimeoout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (activeEditor && activeEditor.isFocused) {
      setFocusedEditor(true);
      clearTimeout(blurTimeoout.current);
    }
    if (!activeEditor || !activeEditor?.isFocused) {
      blurTimeoout.current = setTimeout(() => {
        if (
          !controlsRef.current?.contains(document.activeElement) &&
          !blockMenuRef.current?.contains(document.activeElement)
        ) {
          setFocusedEditor(false);
        }
      }, 50);
    }
  }, [activeEditor, blurTimeoout]);

  const disableFormatting = !focusedEditor;

  const restoreFocusWithTimeout = () => {
    setTimeout(() => {
      activeEditor?.restoreFocus();
    }, 0);
  };

  return (
    <div className={styles["formatting-controls"]} ref={controlsRef}>
      <Button
        data-testid={TestIds.FormattingControls.HighlightButton}
        aria-label="highlight"
        variant="contained"
        tooltip="Create highlight"
        style={{ width: "40px" }}
        onClick={() => {
          activeEditor?.createHighlight();
        }}
      >
        <Highlight fontSize="small" />
      </Button>
      <ToggleButton
        aria-label="bold"
        value="check"
        selected={activeEditor?.bold ?? false}
        disabled={disableFormatting}
        onClick={() => {
          activeEditor?.setBold((bold) => !bold);
        }}
        disableShadow
        fontSize="x-large"
      >
        <FormatBold fontSize="small" />
      </ToggleButton>
      <ToggleButton
        aria-label="italic"
        value="check"
        selected={activeEditor?.italic ?? false}
        disabled={disableFormatting}
        onClick={() => {
          activeEditor?.setItalic((italic) => !italic);
        }}
        disableShadow
        fontSize="x-large"
      >
        <FormatItalic fontSize="small" />
      </ToggleButton>
      <ToggleButton
        aria-label="underline"
        value="check"
        selected={activeEditor?.underline ?? false}
        disabled={disableFormatting}
        onClick={() => {
          activeEditor?.setUnderline((underline) => !underline);
        }}
        disableShadow
        fontSize="x-large"
      >
        <FormatUnderlined fontSize="small" />
      </ToggleButton>
      <ToggleButton
        aria-label="strikethrough"
        value="check"
        selected={activeEditor?.strikethrough ?? false}
        disabled={disableFormatting}
        onClick={() => {
          activeEditor?.setStrikethrough((strikethrough) => !strikethrough);
        }}
        disableShadow
        fontSize="x-large"
      >
        <FormatStrikethrough fontSize="small" />
      </ToggleButton>

      <Select
        value={activeEditor?.blockType ?? "paragraph"}
        disabled={disableFormatting}
        aria-label="Formatting Options"
        data-testid="editor-toolbar-block-format-select"
        menuRef={blockMenuRef}
      >
        <MenuItem
          value={"paragraph"}
          key={"paragraph"}
          selected={activeEditor?.blockType === "paragraph"}
          onClick={() => {
            activeEditor?.setBlockType("paragraph");
            restoreFocusWithTimeout();
          }}
          data-testid="editor-toolbar-block-p-option"
        >
          <i className="bi bi-text-paragraph"></i>
          <span>Normal</span>
        </MenuItem>
        <MenuItem
          value={"h1"}
          key={"h1"}
          selected={activeEditor?.blockType === "h1"}
          onClick={() => {
            activeEditor?.setBlockType("h1");
            restoreFocusWithTimeout();
          }}
          data-testid="editor-toolbar-block-h1-option"
        >
          <i className="bi bi-type-h1"></i>
          <span>Large Heading</span>
        </MenuItem>
        <MenuItem
          value={"h2"}
          key={"h2"}
          selected={activeEditor?.blockType === "h2"}
          onClick={() => {
            activeEditor?.setBlockType("h2");
            restoreFocusWithTimeout();
          }}
        >
          <i className="bi bi-type-h2"></i>
          <span>Small Heading</span>
        </MenuItem>
        <MenuItem
          value={"ul"}
          key={"ul"}
          selected={activeEditor?.blockType === "ul"}
          onClick={() => {
            activeEditor?.setBlockType("ul");
            restoreFocusWithTimeout();
          }}
        >
          <i className="bi bi-list-task"></i>
          <span>Bullet List</span>
        </MenuItem>
        <MenuItem
          value={"ol"}
          key={"ol"}
          selected={activeEditor?.blockType === "ol"}
          onClick={() => {
            activeEditor?.setBlockType("ol");
            restoreFocusWithTimeout();
          }}
        >
          <i className="bi bi-list-ol"></i>
          <span className="text">Numbered List</span>
        </MenuItem>
        <MenuItem
          value={"quote"}
          key={"quote"}
          selected={activeEditor?.blockType === "quote"}
          onClick={() => {
            activeEditor?.setBlockType("quote");
            restoreFocusWithTimeout();
          }}
        >
          <i className="bi bi-blockquote-left"></i>
          <span className="text">Quote</span>
        </MenuItem>
      </Select>
    </div>
  );
};
