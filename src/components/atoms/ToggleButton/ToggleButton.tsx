import { ToggleButton as MuiToggleButton } from "@mui/material";
import {
  box_shadow_primary,
  font_family_sans,
  font_size_small,
  font_weight_light,
  grey500,
  grey700,
} from "components/styles";
import React from "react";

type ToggleButtonProps = {
  variant?: "text" | "outlined";
  disableShadow?: boolean;
  children: React.ReactNode;
} & Pick<
  React.ComponentProps<typeof MuiToggleButton>,
  "selected" | "onClick" | "value" | "disabled"
>;

export const ToggleButton: React.FunctionComponent<ToggleButtonProps> = ({
  children,
  disableShadow,
  variant = "text",
  ...props
}) => {
  const boxShadow =
    (variant === "outlined" && props.selected) || disableShadow
      ? "none"
      : box_shadow_primary;

  return (
    <MuiToggleButton
      style={{
        color: grey700,
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
};
