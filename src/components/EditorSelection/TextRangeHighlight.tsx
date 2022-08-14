import React, { useMemo } from "react";
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

  if (!range || range.START_TO_END === 0) return undefined;

  return <div className={styles["textRangeHighlight"]}>{backgroundDivs}</div>;
};
