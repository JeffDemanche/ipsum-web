import { Button as MuiButton, Tooltip } from "@mui/material";
import React, { useMemo } from "react";

interface ButtonProps extends React.ComponentProps<typeof MuiButton> {
  tooltip?: string;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  tooltip,
  children,
  ...buttonProps
}) => {
  const button = useMemo(
    () => <MuiButton {...buttonProps}>{children}</MuiButton>,
    [buttonProps, children]
  );

  return tooltip ? <Tooltip title={tooltip}>{button}</Tooltip> : button;
};
