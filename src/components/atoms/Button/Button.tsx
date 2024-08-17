import { Button as MuiButton, Tooltip } from "@mui/material";
import cx from "classnames";
import {
  font_family_sans,
  font_size_small,
  font_weight_light,
} from "components/styles";
import React, { CSSProperties } from "react";

import styles from "./Button.less";

type ButtonProps = {
  variant?: "text" | "outlined" | "contained" | "link";
  tooltip?: string;
  disableRipple?: boolean;
  children?: React.ReactNode;
  style?: CSSProperties;
  className?: string;
} & Pick<
  React.ComponentProps<typeof MuiButton>,
  | "onClick"
  | "disabled"
  | "startIcon"
  | "endIcon"
  | "ref"
  | "aria-hidden"
  | "aria-label"
>;

export const Button: React.FunctionComponent<ButtonProps> = ({
  variant,
  tooltip,
  disableRipple,
  children,
  style,
  className,
  ...muiButtonProps
}) => {
  const muiVariant = variant === "link" ? "text" : variant;

  const linkStyle: CSSProperties = {
    fontWeight: font_weight_light,
    fontFamily: font_family_sans,
    fontSize: font_size_small,
    textDecoration: "underline",
    backgroundColor: "transparent",
  };

  const nonLinkStyle: CSSProperties = {
    fontWeight: font_weight_light,
    fontFamily: font_family_sans,
    fontSize: font_size_small,
  };

  const button = (
    <MuiButton
      variant={muiVariant}
      disableRipple={
        disableRipple !== undefined ? disableRipple : variant === "link"
      }
      style={{ ...(variant === "link" ? linkStyle : nonLinkStyle), ...style }}
      className={cx(styles["button"], className)}
      {...muiButtonProps}
    >
      {children}
    </MuiButton>
  );

  return tooltip ? <Tooltip title={tooltip}>{button}</Tooltip> : button;
};
