import React from "react";
import {
  TextField as MuiTextField,
  TextFieldProps as MuiTextFieldProps,
} from "@mui/material";

type TextFieldProps = {
  children: React.ReactNode;
} & MuiTextFieldProps;

export const TextField: React.FC<TextFieldProps> = ({
  children,
  ...textFieldProps
}) => {
  return <MuiTextField {...textFieldProps}>{children}</MuiTextField>;
};
