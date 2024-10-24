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
import React, { CSSProperties } from "react";

import styles from "./Select.less";

type SelectProps = {
  variant?: "outlined" | "text";
  menuRef?: React.RefObject<HTMLDivElement>;
  children: React.ReactNode;
} & Pick<
  React.ComponentProps<typeof MuiSelect>,
  "value" | "className" | "aria-label" | "disabled"
>;

export const Select: React.FunctionComponent<SelectProps> = ({
  variant = "outlined",
  menuRef,
  children,
  ...muiProps
}) => {
  const textStyle: CSSProperties = {
    border: "none",
  };

  const outlinedStyle: CSSProperties = {
    color: grey700,
    borderRadius: border_radius_inputs,
    fontFamily: font_family_sans,
    fontSize: font_size_small,
    fontWeight: font_weight_light,
    boxShadow: box_shadow_primary,
  };

  return (
    <MuiSelect
      {...muiProps}
      SelectDisplayProps={
        variant === "text" ? { style: { padding: "0" } } : null
      }
      variant="outlined"
      MenuProps={{ ref: menuRef }}
      style={variant === "outlined" ? outlinedStyle : textStyle}
      IconComponent={variant === "text" ? null : ExpandMore}
      className={cx(
        muiProps.className,
        styles["select"],
        variant === "text" && styles["text"]
      )}
    >
      {children}
    </MuiSelect>
  );
};
