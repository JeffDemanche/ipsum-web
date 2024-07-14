import { Button } from "@mui/material";
import { border_radius_mini, box_shadow_primary } from "components/styles";
import React, { CSSProperties } from "react";

import styles from "./MiniButton.less";

interface MiniButtonProps {
  fontSize?: "x-small" | "small" | "medium";
  foregroundColor: CSSProperties["color"];
  backgroundColor?: CSSProperties["backgroundColor"];
  children: React.ReactNode;
  onClick?: () => void;
  style?: React.CSSProperties;
}

export const MiniButton: React.FunctionComponent<MiniButtonProps> = ({
  fontSize = "small",
  foregroundColor,
  backgroundColor,
  children,
  onClick,
  style,
}) => {
  const size = {
    "x-small": "12px",
    small: "14px",
    medium: "16px",
  }[fontSize];

  return (
    <Button
      onClick={onClick}
      className={styles["mini-button"]}
      style={{
        width: size,
        minWidth: size,
        height: size,
        minHeight: size,
        backgroundColor: backgroundColor ?? "transparent",
        color: foregroundColor,
        borderRadius: border_radius_mini,
        boxShadow: backgroundColor ? box_shadow_primary : "none",
        ...style,
      }}
    >
      {children}
    </Button>
  );
};
