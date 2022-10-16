import React, { useMemo, useRef } from "react";
import styles from "./TextRangeHighlight.less";
import { IpsumSelectionState } from "util/selection";
import { ArcAssignmentPopper } from "components/ArcAssignmentPopper/ArcAssignmentPopper";

interface TextRangeHighlightProps {
  editorKey: string;
  selection: IpsumSelectionState;
  color?: string;
  onClickAway: () => void;
}

export const TextRangeHighlight: React.FC<TextRangeHighlightProps> = ({
  editorKey,
  selection,
  color,
  onClickAway,
}) => {
  const range = selection.getRange();
  const rectList: DOMRectList = useMemo(() => range?.getClientRects(), [range]);

  const containerRef = useRef<HTMLDivElement>();
  const completeSelectionRef = useRef<HTMLDivElement>();

  const containerTop = containerRef?.current?.getBoundingClientRect().top;
  const containerLeft = containerRef?.current?.getBoundingClientRect().left;

  // Calculates a div for each line of text selection.
  const backgroundDivs = useMemo(() => {
    if (!rectList) return undefined;

    const divs: JSX.Element[] = [];
    for (let i = 0; i < rectList.length; i++) {
      const rect = rectList.item(i);

      const div = (
        <div
          key={i}
          className={styles["highlightDiv"]}
          style={{
            top: `${rect.top - containerTop}px`,
            left: `${rect.left - containerLeft}px`,
            width: `${rect.width}px`,
            height: `${rect.height}px`,
            opacity: 0.4,
            backgroundColor: color,
          }}
        ></div>
      );
      divs.push(div);
    }
    return divs;
  }, [color, containerLeft, containerTop, rectList]);

  // Calculates dims for an element that exactly wraps all selection boxes.
  const completeSelectionDims = useMemo(() => {
    if (!rectList) return undefined;

    let top = Number.MAX_SAFE_INTEGER;
    let left = Number.MAX_SAFE_INTEGER;
    let right = 0;
    let bottom = 0;

    for (let i = 0; i < rectList.length; i++) {
      const rect = rectList.item(i);
      if (rect.top < top) top = rect.top;
      if (rect.left < left) left = rect.left;
      if (rect.bottom > bottom) bottom = rect.bottom;
      if (rect.right > right) right = rect.right;
    }

    const px = (n: number) => `${n}px`;

    return {
      top: px(top - containerTop),
      left: px(left - containerLeft),
      height: px(bottom - top),
      width: px(right - left),
    };
  }, [containerLeft, containerTop, rectList]);

  const anchorEl = useMemo(() => {
    return rectList?.length ? completeSelectionRef.current : null;
  }, [rectList?.length]);

  return (
    <>
      <div className={styles["container"]} ref={containerRef}>
        <div
          className={styles["completeSelection"]}
          style={completeSelectionDims}
          ref={completeSelectionRef}
        ></div>
        {backgroundDivs}
        <ArcAssignmentPopper
          open={Boolean(anchorEl)}
          anchorEl={anchorEl}
          editorKey={editorKey}
          onClose={onClickAway}
        />
      </div>
    </>
  );
};
