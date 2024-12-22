import { Button, Tooltip } from "@mui/material";
import { border_radius_mini, box_shadow_primary } from "components/styles";
import type { CSSProperties } from "react";
import React from "react";

import styles from "./MiniButton.less";

interface MiniButtonProps {
  "data-testid"?: string;
  fontSize?: "x-small" | "small" | "medium";
  foregroundColor: CSSProperties["color"];
  backgroundColor?: CSSProperties["backgroundColor"];
  tooltip?: string;
  children: React.ReactNode;
  onClick?: () => void;
  style?: React.CSSProperties;
}

export const MiniButton: React.FunctionComponent<MiniButtonProps> = ({
  "data-testid": dataTestId,
  fontSize = "small",
  foregroundColor,
  backgroundColor,
  tooltip,
  children,
  onClick,
  style,
}) => {
  const size = {
    "x-small": "16px",
    small: "20px",
    medium: "24px",
  }[fontSize];

  const button = (
    <Button
      data-testid={dataTestId}
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

  return tooltip ? <Tooltip title={tooltip}>{button}</Tooltip> : button;
};
