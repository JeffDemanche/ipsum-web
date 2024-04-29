import { Button } from "components/atoms/Button";
import {
  font_family_sans,
  font_family_serif,
  font_size_citation,
  font_size_inputs_medium,
  font_size_inputs_small,
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
    small: font_size_inputs_small,
    medium: font_size_inputs_medium,
  }[fontSize];

  const elementMinHeight = {
    small: "24px",
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
    minHeight: elementMinHeight,
  };

  return (
    <div
      className={styles["highlight-tag"]}
      style={{
        backgroundColor: `hsla(${hue}, 80%, 95%, 1)`,
        minHeight: elementMinHeight,
      }}
    >
      {objectText && (
        <Button
          style={{
            ...buttonStyle,
            paddingRight: "0px",
            textDecoration: "none",
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
                  fontSize: font_size_citation,
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
        }}
        variant="link"
      >
        {!objectText && highlightNumber !== undefined && (
          <span
            style={{
              color: `hsla(${hue}, 20%, 60%, 1)`,
              fontFamily: font_family_sans,
              fontSize: font_size_citation,
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