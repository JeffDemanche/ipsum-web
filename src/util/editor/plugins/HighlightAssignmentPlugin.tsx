import styles from "./HighlightAssignmentPlugin.less";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { HighlightAssignmentPopper } from "components/HighlightAssignmentPopper";
import {
  $getSelection,
  SELECTION_CHANGE_COMMAND,
  COMMAND_PRIORITY_HIGH,
  BLUR_COMMAND,
  $isRangeSelection,
} from "lexical";
import React, {
  CSSProperties,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

interface HighlightAssignmentPluginProps {
  entryKey: string;
}

export const HighlightAssignmentPlugin: React.FunctionComponent<
  HighlightAssignmentPluginProps
> = ({ entryKey }) => {
  const [editor] = useLexicalComposerContext();

  const [showPopover, setShowPopover] = useState(false);

  const [selectionDomRect, setSelectionDomRect] = useState<DOMRect | null>(
    null
  );

  const selectionWrapperRef = useRef<HTMLDivElement>(null);
  const selectionAnchorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    return editor.registerCommand(
      SELECTION_CHANGE_COMMAND,
      () => {
        const selection = $getSelection();

        if ($isRangeSelection(selection) && !selection.isCollapsed()) {
          const documentSelection = document.getSelection();
          const selectionRect = documentSelection
            .getRangeAt(0)
            ?.getBoundingClientRect();

          setShowPopover(true);
          setSelectionDomRect(selectionRect);
        } else {
          setShowPopover(false);
          setSelectionDomRect(null);
        }

        return true;
      },
      COMMAND_PRIORITY_HIGH
    );
  }, [editor]);

  // useEffect(() => {
  //   return editor.registerCommand(
  //     BLUR_COMMAND,
  //     () => {
  //       setShowPopover(false);
  //       return true;
  //     },
  //     COMMAND_PRIORITY_HIGH
  //   );
  // }, [editor]);

  const selectionAnchorStyle = useMemo((): CSSProperties => {
    const wrapperRect = selectionWrapperRef.current?.getBoundingClientRect();

    return selectionDomRect
      ? {
          top: `${selectionDomRect?.top - wrapperRect?.top}px`,
          left: `${selectionDomRect?.left - wrapperRect?.left}px`,
          width: `${selectionDomRect?.width}px`,
          height: `${selectionDomRect?.height}px`,
        }
      : {};
  }, [selectionDomRect]);

  return (
    <div
      ref={selectionWrapperRef}
      className={styles["editor-text-selection-wrapper"]}
    >
      <div
        ref={selectionAnchorRef}
        style={selectionAnchorStyle}
        className={styles["editor-text-selection"]}
      ></div>
      <HighlightAssignmentPopper
        open={showPopover}
        anchorEl={selectionAnchorRef.current}
        entryKey={entryKey}
      />
    </div>
  );
};
