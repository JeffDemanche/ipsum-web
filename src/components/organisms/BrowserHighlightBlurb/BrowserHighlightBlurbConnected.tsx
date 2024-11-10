import { useHighlightBlurbConnected } from "components/hooks/use-highlight-blurb-connected";
import { HighlightBlurb } from "components/molecules/HighlightBlurb";
import React from "react";

interface BrowserHighlightBlurbConnectedProps {
  highlightId: string;
}

export const BrowserHighlightBlurbConnected: React.FunctionComponent<
  BrowserHighlightBlurbConnectedProps
> = ({ highlightId }) => {
  const highlightProps = useHighlightBlurbConnected({ highlightId });

  return <HighlightBlurb {...highlightProps} />;
};
