import { MenuItem as MuiMenuItem } from "@mui/material";
import React from "react";

type MenuItemProps = {
  children: React.ReactNode;
} & React.ComponentProps<typeof MuiMenuItem>;

export const MenuItem: React.FunctionComponent<MenuItemProps> = ({
  children,
  ...muiProps
}) => {
  return <MuiMenuItem {...muiProps}>{children}</MuiMenuItem>;
};
