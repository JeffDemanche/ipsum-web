import { ToggleButton as MuiToggleButton } from "@mui/material";
import {
  font_family_sans,
  font_size_small,
  font_weight_light,
  grey500,
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
        fontWeight: font_weight_light,
        fontFamily: font_family_sans,
        fontSize: font_size_small,
        border: variant === "text" ? "none" : `1px solid ${grey500}`,
      }}
      {...props}
    >
      {children}
    </MuiToggleButton>
  );
};
