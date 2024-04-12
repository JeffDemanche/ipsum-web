import React from "react";
import styles from "./Select.less";
import { Select as MuiSelect } from "@mui/material";

type SelectProps = {
  menuRef?: React.RefObject<HTMLDivElement>;
  children: React.ReactNode;
} & Pick<
  React.ComponentProps<typeof MuiSelect>,
  "value" | "className" | "aria-label" | "disabled"
>;

export const Select: React.FunctionComponent<SelectProps> = ({
  menuRef,
  children,
  ...muiProps
}) => {
  return (
    <MuiSelect
      {...muiProps}
      className={styles["select"]}
      MenuProps={{ ref: menuRef }}
    >
      {children}
    </MuiSelect>
  );
};
