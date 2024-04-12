import { Typography as MuiTypography } from "@mui/material";
import React from "react";

import { TypeLineHeight, TypeSize, TypeVariant, TypeWeight } from "./types";

interface TypeProps {
  variant: TypeVariant;
  weight: TypeWeight;
  size: TypeSize;
  lineHeight: TypeLineHeight;
  component?: React.ElementType;
  children: React.ReactNode;
}

const variantToMuiVariant = (variant: TypeVariant) => {
  switch (variant) {
    case "body":
      return "body1";
    case "caption":
      return "caption";
    case "heading":
      return "h1";
    default:
      return "body1";
  }
};

export const Type: React.FunctionComponent<TypeProps> = ({
  variant,
  weight,
  size,
  lineHeight,
  component,
  children,
}) => {
  return (
    <MuiTypography
      variant={variantToMuiVariant(variant)}
      fontWeight={weight}
      fontSize={size}
      lineHeight={lineHeight}
      component={component}
    >
      {children}
    </MuiTypography>
  );
};
