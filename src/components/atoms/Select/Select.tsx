import { Select as MuiSelect } from "@mui/material";
import { border_radius_inputs } from "components/styles";
import React from "react";

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
      MenuProps={{ ref: menuRef }}
      style={{ borderRadius: border_radius_inputs }}
    >
      {children}
    </MuiSelect>
  );
};
