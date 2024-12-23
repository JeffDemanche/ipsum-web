import { Button as MuiButton, Tooltip } from "@mui/material";
import cx from "classnames";
import { font_family_sans, font_weight_light } from "components/styles";
import type { CSSProperties} from "react";
import React, { forwardRef } from "react";

import styles from "./Button.less";

type ButtonProps = {
  variant?: "text" | "outlined" | "contained" | "link";
  tooltip?: JSX.Element | string;
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
  | "onMouseEnter"
  | "onMouseLeave"
>;

export const Button: React.FunctionComponent<ButtonProps> = forwardRef(
  (
    {
      variant,
      tooltip,
      disableRipple,
      children,
      style,
      className,
      ...muiButtonProps
    },
    ref
  ) => {
    const muiVariant = variant === "link" ? "text" : variant;

    const linkStyle: CSSProperties = {
      fontWeight: font_weight_light,
      fontFamily: font_family_sans,
      textDecoration: "underline",
      backgroundColor: "transparent",
      verticalAlign: "baseline",
      height: "unset",
      lineHeight: "unset",
      padding: 0,
    };

    const nonLinkStyle: CSSProperties = {
      fontWeight: font_weight_light,
      fontFamily: font_family_sans,
    };

    const button = (
      <MuiButton
        ref={ref}
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
  }
);

Button.displayName = "Button";
