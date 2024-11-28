import { ToggleButton as MuiToggleButton, Tooltip } from "@mui/material";
import {
  box_shadow_primary,
  font_family_sans,
  font_size_small,
  font_weight_light,
  grey500,
  grey700,
} from "components/styles";
import React, { CSSProperties } from "react";

type ToggleButtonProps = {
  variant?: "text" | "outlined";
  fontSize?: "x-small" | "small" | "medium" | "large" | "x-large";
  disableShadow?: boolean;
  tooltip?: JSX.Element | string;
  foregroundColor?: CSSProperties["color"];
  children: React.ReactNode;
} & Pick<
  React.ComponentProps<typeof MuiToggleButton>,
  "selected" | "onClick" | "value" | "disabled"
>;

export const ToggleButton: React.FunctionComponent<ToggleButtonProps> = ({
  children,
  disableShadow,
  fontSize = "small",
  tooltip,
  foregroundColor = grey700,
  variant = "text",
  ...props
}) => {
  const boxShadow =
    (variant === "outlined" && props.selected) || disableShadow
      ? "none"
      : box_shadow_primary;

  const size = {
    "x-small": "16px",
    small: "20px",
    medium: "24px",
    large: "32px",
    "x-large": "40px",
  }[fontSize];

  const button = (
    <MuiToggleButton
      style={{
        color: foregroundColor,
        minWidth: size,
        height: size,
        minHeight: size,
        fontWeight: font_weight_light,
        fontFamily: font_family_sans,
        fontSize: font_size_small,
        boxShadow,
        border: variant === "text" ? "none" : `1px solid ${grey500}`,
      }}
      {...props}
    >
      {children}
    </MuiToggleButton>
  );

  return tooltip ? <Tooltip title={tooltip}>{button}</Tooltip> : button;
};
