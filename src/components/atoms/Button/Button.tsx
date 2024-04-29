import { Button as MuiButton, Tooltip } from "@mui/material";
import cx from "classnames";
import {
  font_family_inputs,
  font_size_inputs_small,
  font_weight_inputs,
} from "components/styles";
import React, { CSSProperties } from "react";

import styles from "./Button.less";

type ButtonProps = {
  variant?: "text" | "outlined" | "contained" | "link";
  tooltip?: string;
  children?: React.ReactNode;
  style?: CSSProperties;
  className?: string;
} & Pick<
  React.ComponentProps<typeof MuiButton>,
  "onClick" | "disabled" | "startIcon" | "endIcon"
>;

export const Button: React.FunctionComponent<ButtonProps> = ({
  variant,
  tooltip,
  children,
  style,
  className,
  ...muiButtonProps
}) => {
  const muiVariant = variant === "link" ? "text" : variant;

  const linkStyle: CSSProperties = {
    fontWeight: font_weight_inputs,
    fontFamily: font_family_inputs,
    fontSize: font_size_inputs_small,
    textDecoration: "underline",
    backgroundColor: "transparent",
  };

  const nonLinkStyle: CSSProperties = {
    fontWeight: font_weight_inputs,
    fontFamily: font_family_inputs,
    fontSize: font_size_inputs_small,
  };

  return (
    <Tooltip title={tooltip}>
      <MuiButton
        variant={muiVariant}
        disableRipple={variant === "link"}
        style={{ ...(variant === "link" ? linkStyle : nonLinkStyle), ...style }}
        className={cx(styles["button"], className)}
        {...muiButtonProps}
      >
        {children}
      </MuiButton>
    </Tooltip>
  );
};
