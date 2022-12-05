import { Paper, Popper as MuiPopper } from "@mui/material";
import React, { ComponentProps } from "react";

type PopperProps = {
  children: React.ReactNode;
} & ComponentProps<typeof MuiPopper>;

export const Popper: React.FC<PopperProps> = ({
  children,
  ...muiPopperProps
}) => {
  return (
    <MuiPopper style={{ zIndex: 2 }} {...muiPopperProps}>
      <Paper elevation={2}>{children}</Paper>
    </MuiPopper>
  );
};
