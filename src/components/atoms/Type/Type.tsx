import React from "react";

import { Typography as MuiTypography } from "@mui/material";
import { TypeSize, TypeVariant, TypeWeight } from "./types";

interface TypeProps {
  variant: TypeVariant;
  weight: TypeWeight;
  size: TypeSize;
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
  children,
}) => {
  return (
    <MuiTypography
      variant={variantToMuiVariant(variant)}
      fontWeight={weight}
      fontSize={size}
    >
      {children}
    </MuiTypography>
  );
};
