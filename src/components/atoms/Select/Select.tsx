import { ExpandMore } from "@mui/icons-material";
import { Select as MuiSelect } from "@mui/material";
import cx from "classnames";
import {
  border_radius_inputs,
  box_shadow_primary,
  font_family_sans,
  font_size_small,
  font_weight_light,
  grey700,
} from "components/styles";
import React from "react";

import styles from "./Select.less";

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
      variant="outlined"
      MenuProps={{ ref: menuRef }}
      style={{
        color: grey700,
        borderRadius: border_radius_inputs,
        fontFamily: font_family_sans,
        fontSize: font_size_small,
        fontWeight: font_weight_light,
        boxShadow: box_shadow_primary,
      }}
      IconComponent={ExpandMore}
      className={cx(muiProps.className, styles["select"])}
    >
      {children}
    </MuiSelect>
  );
};
