import { Tooltip, Typography as MuiTypography } from "@mui/material";
import type { CSSProperties} from "react";
import React, { forwardRef } from "react";

import type { TypeLineHeight, TypeSize, TypeVariant, TypeWeight } from "./types";

type TypeProps = {
  variant?: TypeVariant;
  weight?: TypeWeight;
  size?: TypeSize;
  underline?: boolean;
  lineHeight?: TypeLineHeight;
  component?: React.ElementType;
  tooltip?: string;
  children: React.ReactNode;
} & Pick<
  React.ComponentProps<typeof MuiTypography>,
  "color" | "style" | "display" | "className"
>;

const variantToMuiVariant = (variant: TypeVariant) => {
  switch (variant) {
    case "body":
      return "body1";
    case "caption":
      return "caption";
    case "heading":
      return "h1";
    case "serif":
      return "h1";
    case "sans":
      return "body1";
    default:
      return "body1";
  }
};

const sizeToCSSSize = (size: TypeSize): CSSProperties["fontSize"] => {
  switch (size) {
    case "8pt":
      return "8pt";
    case "12pt":
      return "12pt";
    case "14pt":
      return "14pt";
    case "16pt":
      return "16pt";
    case "24pt":
      return "24pt";
    case "36pt":
      return "36pt";
    case "x-small":
      return "12px";
    case "small":
      return "14px";
    case "medium":
      return "18px";
    case "large":
      return "28px";
    default:
      return "16pt";
  }
};

export const Type: React.FunctionComponent<TypeProps> = forwardRef(
  (
    {
      variant = "body",
      weight = "regular",
      size = "16pt",
      underline = false,
      lineHeight = 1.5,
      component,
      children,
      color,
      tooltip,
      ...muiTypographyProps
    },
    _
  ) => {
    const type = (
      <MuiTypography
        variant={variantToMuiVariant(variant)}
        fontWeight={weight}
        fontSize={sizeToCSSSize(size)}
        lineHeight={lineHeight}
        component={component}
        color={color}
        sx={{ textDecoration: underline ? "underline" : "none" }}
        {...muiTypographyProps}
      >
        {children}
      </MuiTypography>
    );

    return tooltip ? <Tooltip title={tooltip}>{type}</Tooltip> : type;
  }
);

Type.displayName = "Type";
