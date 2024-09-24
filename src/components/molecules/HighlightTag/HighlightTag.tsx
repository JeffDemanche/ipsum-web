import { Button } from "components/atoms/Button";
import {
  font_family_sans,
  font_family_serif,
  font_size_medium,
  font_size_small,
  font_size_x_small,
  font_weight_citation,
} from "components/styles";
import React, { useMemo } from "react";
import { TestIds } from "util/test-ids";

import styles from "./HighlightTag.less";

interface HighlightTagProps {
  hue: number;
  fontSize?: "x-small" | "small" | "medium";

  /** I.e. date, arc, whatever the highlight is on, etc. */
  objectText?: string;
  arcNames?: string[];
  highlightNumber?: number;

  onObjectTextClick?: () => void;
  onHighlightClick?: () => void;
}

export const HighlightTag: React.FunctionComponent<HighlightTagProps> = ({
  hue,
  fontSize = "medium",
  objectText,
  arcNames,
  highlightNumber,
  onObjectTextClick,
  onHighlightClick,
}) => {
  const fontSizePx = {
    "x-small": font_size_x_small,
    small: font_size_small,
    medium: font_size_medium,
  }[fontSize];

  const elementHeight = {
    "x-small": "18px",
    small: "22px",
    medium: "28px",
  }[fontSize];

  const arcsText = useMemo(() => {
    if (arcNames && arcNames.length > 0) {
      return arcNames.join(", ");
    }
    return "no relations";
  }, [arcNames]);

  const buttonStyle = {
    fontSize: fontSizePx,
    paddingTop: "0",
    paddingBottom: "0",
    color: `hsla(${hue ?? 0}, ${hue === null ? "0%" : "20%"}, 40%, 1)`,
    backgroundColor: "transparent",
    minHeight: elementHeight,
  };

  return (
    <div className={styles["highlight-tag-wrapper"]}>
      <div
        className={styles["highlight-tag"]}
        style={{
          backgroundColor: `hsla(${hue ?? 0}, ${hue === null ? "0%" : "80%"}, 95%, 1)`,
          minHeight: elementHeight,
        }}
      >
        {objectText && (
          <Button
            style={{
              ...buttonStyle,
              paddingRight: "4px",
              textDecoration: "none",
              height: elementHeight,
              flexShrink: 0,
            }}
            variant="link"
            disableRipple={false}
            onClick={onObjectTextClick}
          >
            <span>
              {objectText}
              {highlightNumber !== undefined && (
                <sup
                  style={{
                    color: `hsla(${hue ?? 0}, ${hue === null ? "0%" : "20%"}, 60%, 1)`,
                    textDecoration: "none",
                    fontWeight: font_weight_citation,
                    lineHeight: 0,
                  }}
                >
                  {highlightNumber}
                </sup>
              )}
            </span>
          </Button>
        )}
        <Button
          style={{
            ...buttonStyle,
            textDecoration: "none",
            paddingLeft: "4px",
            fontFamily: font_family_serif,
            height: elementHeight,
            display: "inline-block",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
          variant="link"
          disableRipple={false}
          onClick={onHighlightClick}
        >
          {!objectText && highlightNumber !== undefined && (
            <span
              style={{
                color: `hsla(${hue ?? 0}, ${hue === null ? "0%" : "20%"}, 60%, 1)`,
                fontFamily: font_family_sans,
                fontSize: font_size_x_small,
                fontWeight: font_weight_citation,
                paddingRight: "4px",
              }}
            >
              {highlightNumber}
            </span>
          )}
          {arcsText}
        </Button>
      </div>
    </div>
  );
};
