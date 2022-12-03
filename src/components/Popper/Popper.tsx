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
    <MuiPopper style={{ zIndex: 1 }} {...muiPopperProps}>
      <Paper
        elevation={1}
        sx={(theme) => ({ backgroundColor: theme.palette.secondary.dark })}
      >
        {children}
      </Paper>
    </MuiPopper>
  );
};
