import { EntryEditor } from "components/atoms/EntryEditor";
import {
  FormattingControls,
  FormattingControlsProvider,
} from "components/molecules/FormattingControls";
import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";

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
