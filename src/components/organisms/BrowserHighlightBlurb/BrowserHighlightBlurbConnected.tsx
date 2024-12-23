import ErrorBoundary from "components/atoms/ErrorBoundary";
import { useHighlightBlurbConnected } from "components/hooks/use-highlight-blurb-connected";
import { HighlightBlurb } from "components/molecules/HighlightBlurb";
import React from "react";

interface BrowserHighlightBlurbConnectedProps {
  highlightId: string;
}

export const BrowserHighlightBlurbConnected: React.FunctionComponent<
  BrowserHighlightBlurbConnectedProps
> = (props) => {
  return (
    <ErrorBoundary fallback={<div>Highlight blurb error</div>}>
      <WithErrorBoundary {...props} />
    </ErrorBoundary>
  );
};

const WithErrorBoundary: React.FunctionComponent<
  BrowserHighlightBlurbConnectedProps
> = ({ highlightId }) => {
  const highlightProps = useHighlightBlurbConnected({ highlightId });

  return <HighlightBlurb {...highlightProps} />;
};
