import React from "react";

import { Button as MuiButton } from "@mui/material";

interface ButtonProps {
  iconBefore?: React.ReactNode;
  iconAfter?: React.ReactNode;
  children: React.ReactNode;
}

export const Button: React.FunctionComponent<ButtonProps> = ({
  iconBefore,
  iconAfter,
  children,
}) => {
  return <MuiButton style={{ fontFamily: "Amstelvar" }}>{children}</MuiButton>;
};
