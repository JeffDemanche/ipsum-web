import { Popover, Typography } from "@mui/material";
import React, { useMemo, useRef } from "react";
import styles from "./TextRangeHighlight.less";

interface TextRangeHighlightProps {
  range: Range;
  color: string;
}

export const TextRangeHighlight: React.FC<TextRangeHighlightProps> = ({
  range,
  color,
}) => {
  const rectList: DOMRectList = useMemo(() => range?.getClientRects(), [range]);

  const backgroundDivs = useMemo(() => {
    if (!rectList) return undefined;

    const divs: JSX.Element[] = [];
    for (let i = 0; i < rectList.length; i++) {
      const rect = rectList.item(i);

      const div = (
        <div
          key={i}
          style={{
            top: `${rect.top}px`,
            left: `${rect.left}px`,
            width: `${rect.width}px`,
            height: `${rect.height}px`,
            backgroundColor: color,
          }}
        ></div>
      );
      divs.push(div);
    }
    return divs;
  }, [color, rectList]);

  const parentDims = useMemo(() => {
    if (!rectList?.length) return {};

    let lowestLeft = Number.MAX_SAFE_INTEGER;
    let lowestTop = Number.MAX_SAFE_INTEGER;
    let highestRight = 0;
    let highestBottom = 0;

    for (let i = 0; i < rectList.length; i++) {
      const rect = rectList.item(i);
      if (rect.left < lowestLeft) lowestLeft = rect.left;
      if (rect.top < lowestTop) lowestTop = rect.top;
      if (rect.right > highestRight) highestRight = rect.right;
      if (rect.bottom > highestBottom) highestBottom = rect.bottom;
    }

    return {
      left: `${lowestLeft}px`,
      top: `${lowestTop}px`,
      width: `${highestRight - lowestLeft}px`,
      height: `${highestBottom - lowestTop}px`,
    };
  }, [rectList]);

  const ref = useRef<HTMLDivElement>();

  const anchorEl = useMemo(() => {
    return rectList?.length ? ref.current : null;
  }, [rectList?.length]);

  return (
    <>
      <div className={styles["fixedContainer"]}>
        <div
          className={styles["textRangeHighlight"]}
          style={parentDims}
          ref={ref}
        >
          {backgroundDivs}
        </div>
      </div>
      <Popover
        id="new-arc-popover"
        disableAutoFocus
        disableScrollLock
        disableEnforceFocus
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Typography>Some text</Typography>
      </Popover>
    </>
  );
};
