import { TextField as MuiTextField } from "@mui/material";
import cx from "classnames";
import { grid_x_1 } from "components/styles";
import React, { FunctionComponent } from "react";

import styles from "./TextField.less";

type TextFieldProps = {
  variant?: "outlined" | "underlined";
} & Pick<
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
  | "placeholder"
>;

export const TextField: FunctionComponent<TextFieldProps> = ({
  variant = "outlined",
  ...muiTextFieldProps
}) => {
  return (
    <MuiTextField
      {...muiTextFieldProps}
      className={cx(
        styles["textfield"],
        muiTextFieldProps.className,
        variant === "outlined" ? styles["outlined"] : styles["underlined"]
      )}
      inputProps={{
        style: { padding: grid_x_1 },
      }}
    ></MuiTextField>
  );
};
