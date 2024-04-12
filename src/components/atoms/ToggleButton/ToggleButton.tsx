import { ToggleButton as MuiToggleButton } from "@mui/material";
import {
  font_family_inputs,
  font_size_inputs,
  font_weight_inputs,
  grey500,
  grid_x_5,
} from "components/styles";
import React from "react";

type ToggleButtonProps = {
  variant?: "text" | "outlined";
  children: React.ReactNode;
} & React.ComponentProps<typeof MuiToggleButton>;

export const ToggleButton: React.FunctionComponent<ToggleButtonProps> = ({
  children,
  variant = "text",
  ...props
}) => {
  return (
    <MuiToggleButton
      style={{
        fontWeight: font_weight_inputs,
        fontFamily: font_family_inputs,
        fontSize: font_size_inputs,
        height: grid_x_5,
        border: variant === "text" ? "none" : `1px solid ${grey500}`,
      }}
      {...props}
    >
      {children}
    </MuiToggleButton>
  );
};
