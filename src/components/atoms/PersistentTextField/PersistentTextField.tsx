import React, { FunctionComponent, useEffect, useState } from "react";

import { Button } from "../Button";
import { TextField } from "../TextField";

interface PersistentTextFieldProps {
  textFieldClassName?: string;
  defaultValue: string;
  onChange?: (value: string) => void;
}

export const PersistentTextField: FunctionComponent<
  PersistentTextFieldProps
> = ({ textFieldClassName, defaultValue, onChange }) => {
  const [value, setValue] = useState(defaultValue);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    onChange?.(value);
  }, [onChange, value]);

  return editing ? (
    <TextField
      style={{ textAlign: "center" }}
      className={textFieldClassName}
      autoFocus
      value={value}
      onChange={(e) => {
        setValue(e.target.value);
      }}
      onBlur={(e) => {
        setValue(e.target.value);
        setEditing(false);
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          setValue((e.target as HTMLInputElement).value);
          setEditing(false);
        }
      }}
    />
  ) : (
    <Button
      variant="text"
      onClick={() => {
        setEditing(true);
      }}
    >
      {value}
    </Button>
  );
};
