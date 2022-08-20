import { Popper as MuiPopper } from "@mui/material";
import React, { ComponentProps } from "react";
import styles from "./Popper.less";

type PopperProps = {
  children: React.ReactNode;
} & ComponentProps<typeof MuiPopper>;

export const Popper: React.FC<PopperProps> = ({
  children,
  ...muiPopperProps
}) => {
  return (
    <MuiPopper {...muiPopperProps}>
      <div className={styles["popperContainer"]}>{children}</div>
    </MuiPopper>
  );
};
