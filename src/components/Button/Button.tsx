import React from "react";
import styles from "./Button.less";
import { Button as MuiButton } from "@mui/material";

interface ButtonProps extends React.ComponentProps<typeof MuiButton> {
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ children, ...buttonProps }) => {
  return (
    <MuiButton className={styles["button"]} {...buttonProps}>
      {children}
    </MuiButton>
  );
};
