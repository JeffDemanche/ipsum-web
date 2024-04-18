import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";

import { EntryEditor } from "../../../atoms/EntryEditor";
import { FormattingControls } from "../FormattingControls";
import { FormattingControlsProvider } from "../FormattingControlsContext";

export const WithEditor: React.FunctionComponent = () => {
  const [highlightsMap, setHighlightsMap] = useState<
    Record<string, { id: string; hue: number }>
  >({});

  return (
    <FormattingControlsProvider>
      <FormattingControls />
      <EntryEditor
        highlightsMap={highlightsMap}
        createHighlight={() => {
          const id = uuidv4();
          setHighlightsMap((prev) => ({
            ...prev,
            [id]: { id, hue: Math.floor(Math.random() * 360) },
          }));
          return id;
        }}
      />
    </FormattingControlsProvider>
  );
};
