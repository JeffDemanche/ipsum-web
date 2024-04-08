import React, { CSSProperties } from "react";

import { Button as MuiButton } from "@mui/material";

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
    fontWeight: "lighter",
    fontFamily: "Roboto",
    fontSize: "12px",
    textDecoration: "underline",
    backgroundColor: "transparent",
  };

  const nonLinkStyle: CSSProperties = {
    fontWeight: "lighter",
    fontFamily: "Roboto",
    fontSize: "12px",
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
