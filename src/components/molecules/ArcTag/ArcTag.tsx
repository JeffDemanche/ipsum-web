import { Close } from "@mui/icons-material";
import { Button } from "components/atoms/Button";
import {
  font_family_serif,
  font_size_inputs_medium,
  font_size_inputs_small,
} from "components/styles";
import React from "react";

import styles from "./ArcTag.less";

interface ArcTagProps {
  text: string;
  hue: number;
  fontSize?: "small" | "medium";
  onDelete?: () => void;
}

export const ArcTag: React.FunctionComponent<ArcTagProps> = ({
  text,
  hue,
  fontSize = "medium",
  onDelete,
}) => {
  const fontSizePx = {
    small: font_size_inputs_small,
    medium: font_size_inputs_medium,
  }[fontSize];

  const elementMaxHeight = {
    small: "24px",
    medium: "28px",
  }[fontSize];

  return (
    <div
      className={styles["arc-tag"]}
      style={{
        backgroundColor: `hsla(${hue}, 20%, 40%, 1)`,
      }}
    >
      <Button
        className={styles["link-button"]}
        style={{
          gap: "4px",
          paddingTop: "0",
          paddingBottom: "0",
          fontFamily: font_family_serif,
          fontSize: fontSizePx,
          minWidth: "0",
          maxHeight: elementMaxHeight,
          color: `hsla(${hue}, 40%, 95%, 1)`,
        }}
      >
        {text}
      </Button>
      {onDelete && (
        <Button
          className={styles["delete-button"]}
          style={{
            maxHeight: elementMaxHeight,
            color: `hsla(${hue}, 40%, 95%, 1)`,
          }}
        >
          <Close fontSize="small" />
        </Button>
      )}
    </div>
  );
};
