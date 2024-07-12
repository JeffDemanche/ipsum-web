import React from "react";

interface BrowserHighlightsTabProps {
  optionsExpanded: boolean;

  highlights: { id: string[] };

  onOptionsExpand: () => void;
  onOptionsCollapse: () => void;
}

export const BrowserHighlightsTab: React.FunctionComponent<
  BrowserHighlightsTabProps
> = ({ optionsExpanded, onOptionsExpand, onOptionsCollapse }) => {
  return <div></div>;
};
