import { CloseSharp, EditSharp, FingerprintSharp } from "@mui/icons-material";
import cx from "classnames";
import { Button } from "components/atoms/Button";
import { MiniButton } from "components/atoms/MiniButton";
import {
  font_family_sans,
  font_size_medium,
  font_size_small,
  font_size_x_small,
} from "components/styles";
import React from "react";

import styles from "./ArcTag.less";

interface ArcTagProps {
  text: string;
  hue: number;
  fontSize?: "x-small" | "small" | "medium";

  showAlias?: boolean;
  showEdit?: boolean;
  showDelete?: boolean;

  onDelete?: () => void;
}

export const ArcTag: React.FunctionComponent<ArcTagProps> = ({
  text,
  hue,
  fontSize = "medium",
  showAlias,
  showEdit,
  showDelete,
  onDelete,
}) => {
  const fontSizePx = {
    "x-small": font_size_x_small,
    small: font_size_small,
    medium: font_size_medium,
  }[fontSize];

  const elementMaxHeight = {
    "x-small": "18px",
    small: "24px",
    medium: "28px",
  }[fontSize];

  const visibleIcons = showAlias || showEdit || showDelete;

  const miniButtonSize: "x-small" | "small" = {
    "x-small": "x-small",
    small: "small",
    medium: "small",
  }[fontSize] as "x-small" | "small";

  return (
    <div
      className={cx(styles["arc-tag"], visibleIcons && styles["visible-icons"])}
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
          fontFamily: font_family_sans,
          fontSize: fontSizePx,
          minWidth: "0",
          maxHeight: elementMaxHeight,
          color: `hsla(${hue}, 40%, 95%, 1)`,
        }}
      >
        {text}
      </Button>
      <div className={styles["arc-tag-items"]}>
        {showAlias && (
          <MiniButton
            fontSize={miniButtonSize}
            foregroundColor={`hsla(${hue}, 38%, 95%, 1)`}
          >
            <FingerprintSharp fontSize="small" />
          </MiniButton>
        )}
        {showEdit && (
          <MiniButton
            fontSize={miniButtonSize}
            backgroundColor={`hsla(${hue}, 38%, 95%, 1)`}
            foregroundColor={`hsla(${hue}, 20%, 40%, 1)`}
          >
            <EditSharp fontSize="small" />
          </MiniButton>
        )}
        {showDelete && (
          <MiniButton
            fontSize={miniButtonSize}
            foregroundColor={`hsla(${hue}, 38%, 95%, 1)`}
            onClick={onDelete}
          >
            <CloseSharp fontSize="small" />
          </MiniButton>
        )}
      </div>
    </div>
  );
};
