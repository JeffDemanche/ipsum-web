import { Button as MuiButton, Tooltip } from "@mui/material";
import React, { useMemo } from "react";

interface ButtonProps
  extends Pick<
    React.ComponentProps<typeof MuiButton>,
    | "variant"
    | "startIcon"
    | "endIcon"
    | "className"
    | "style"
    | "aria-label"
    | "disabled"
    | "onClick"
  > {
  tooltip?: string;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  tooltip,
  children,
  ...buttonProps
}) => {
  const button = useMemo(
    () => (
      <MuiButton
        {...buttonProps}
        style={{ minWidth: "42px", ...buttonProps.style }}
      >
        {children}
      </MuiButton>
    ),
    [buttonProps, children]
  );

  return tooltip && !buttonProps.disabled ? (
    <Tooltip title={tooltip}>{button}</Tooltip>
  ) : (
    button
  );
};
