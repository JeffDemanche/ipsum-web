import React from "react";
import { FormattingControlsContextType } from "./types";

export const FormattingControlsContext =
  React.createContext<FormattingControlsContextType>({
    activeEditor: null,
    setActiveEditor: null,
  });

export const FormattingControlsProvider: React.FunctionComponent<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [activeEditor, setActiveEditor] =
    React.useState<FormattingControlsContextType["activeEditor"]>(null);

  return (
    <FormattingControlsContext.Provider
      value={{ activeEditor, setActiveEditor }}
    >
      {children}
    </FormattingControlsContext.Provider>
  );
};
