import { Typography as MuiTypography } from "@mui/material";
import React, { CSSProperties } from "react";

import { TypeLineHeight, TypeSize, TypeVariant, TypeWeight } from "./types";

type TypeProps = {
  variant?: TypeVariant;
  weight?: TypeWeight;
  size?: TypeSize;
  lineHeight?: TypeLineHeight;
  component?: React.ElementType;
  children: React.ReactNode;
} & Pick<React.ComponentProps<typeof MuiTypography>, "style">;

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
    default:
      return "16pt";
  }
};

export const Type: React.FunctionComponent<TypeProps> = ({
  variant = "body",
  weight = "regular",
  size = "16pt",
  lineHeight = 1.5,
  component,
  children,
  ...muiTypographyProps
}) => {
  return (
    <MuiTypography
      variant={variantToMuiVariant(variant)}
      fontWeight={weight}
      fontSize={sizeToCSSSize(size)}
      lineHeight={lineHeight}
      component={component}
      {...muiTypographyProps}
    >
      {children}
    </MuiTypography>
  );
};
