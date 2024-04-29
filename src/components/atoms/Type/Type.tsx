import { Typography as MuiTypography } from "@mui/material";
import React from "react";

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
      fontSize={size}
      lineHeight={lineHeight}
      component={component}
      {...muiTypographyProps}
    >
      {children}
    </MuiTypography>
  );
};
