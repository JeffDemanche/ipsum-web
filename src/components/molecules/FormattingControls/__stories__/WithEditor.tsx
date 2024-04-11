import React from "react";

import { IpsumEditor } from "../../../atoms/EntryEditor";
import { FormattingControls } from "../FormattingControls";
import { FormattingControlsProvider } from "../FormattingControlsContext";

export const WithEditor: React.FunctionComponent = () => {
  return (
    <FormattingControlsProvider>
      <FormattingControls />
      <IpsumEditor />
    </FormattingControlsProvider>
  );
};
