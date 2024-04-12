import { Button as MuiButton } from "@mui/material";
import {
  font_family_inputs,
  font_size_inputs,
  font_weight_inputs,
} from "components/styles";
import React, { CSSProperties } from "react";

interface ButtonProps {
  variant?: "text" | "outlined" | "contained" | "link";
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  children: React.ReactNode;
}

export const Button: React.FunctionComponent<ButtonProps> = ({
  variant,
  startIcon,
  endIcon,
  children,
}) => {
  const muiVariant = variant === "link" ? "text" : variant;

  const linkStyle: CSSProperties = {
    fontWeight: font_weight_inputs,
    fontFamily: font_family_inputs,
    fontSize: font_size_inputs,
    textDecoration: "underline",
    backgroundColor: "transparent",
  };

  const nonLinkStyle: CSSProperties = {
    fontWeight: font_weight_inputs,
    fontFamily: font_family_inputs,
    fontSize: font_size_inputs,
  };

  return (
    <MuiButton
      variant={muiVariant}
      startIcon={startIcon}
      endIcon={endIcon}
      disableRipple={variant === "link"}
      style={variant === "link" ? linkStyle : nonLinkStyle}
    >
      {children}
    </MuiButton>
  );
};
