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

import styles from "./HighlightTag.less";

interface HighlightTagProps {
  hue: number;
  fontSize?: "small" | "medium";

  /** I.e. date, arc, whatever the highlight is on, etc. */
  objectText?: string;
  arcNames?: string[];
  highlightNumber?: number;
}

export const HighlightTag: React.FunctionComponent<HighlightTagProps> = ({
  hue,
  fontSize = "medium",
  objectText,
  arcNames,
  highlightNumber,
}) => {
  const fontSizePx = {
    small: font_size_small,
    medium: font_size_medium,
  }[fontSize];

  const elementHeight = {
    xSmall: "18px",
    small: "22px",
    medium: "28px",
  }[fontSize];

  const arcsText = useMemo(() => {
    if (arcNames) {
      return arcNames.join(", ");
    }
    return "no arcs";
  }, [arcNames]);

  const buttonStyle = {
    fontSize: fontSizePx,
    paddingTop: "0",
    paddingBottom: "0",
    color: `hsla(${hue}, 20%, 40%, 1)`,
    backgroundColor: "transparent",
    minHeight: elementHeight,
  };

  return (
    <div
      className={styles["highlight-tag"]}
      style={{
        backgroundColor: `hsla(${hue}, 80%, 95%, 1)`,
        minHeight: elementHeight,
      }}
    >
      {objectText && (
        <Button
          style={{
            ...buttonStyle,
            paddingRight: "0px",
            textDecoration: "none",
            height: elementHeight,
          }}
          variant="link"
        >
          <span>
            {objectText}
            {highlightNumber !== undefined && (
              <sup
                style={{
                  color: `hsla(${hue}, 20%, 60%, 1)`,
                  textDecoration: "none",
                  fontSize: font_size_x_small,
                  fontWeight: font_weight_citation,
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
          fontFamily: font_family_serif,
          height: elementHeight,
        }}
        variant="link"
      >
        {!objectText && highlightNumber !== undefined && (
          <span
            style={{
              color: `hsla(${hue}, 20%, 60%, 1)`,
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
  );
};
