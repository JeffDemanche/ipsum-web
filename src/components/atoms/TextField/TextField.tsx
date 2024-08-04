import { TextField as MuiTextField } from "@mui/material";
import { grid_x_1 } from "components/styles";
import React, { FunctionComponent } from "react";

type TextFieldProps = Pick<
  React.ComponentProps<typeof MuiTextField>,
  | "value"
  | "onBlur"
  | "autoFocus"
  | "autoComplete"
  | "onChange"
  | "onKeyDown"
  | "defaultValue"
  | "className"
  | "style"
>;

export const TextField: FunctionComponent<TextFieldProps> = ({
  ...muiTextFieldProps
}) => {
  return (
    <MuiTextField
      inputProps={{ style: { padding: grid_x_1 } }}
      {...muiTextFieldProps}
    ></MuiTextField>
  );
};
