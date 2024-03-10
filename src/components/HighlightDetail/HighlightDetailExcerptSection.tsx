import { HighlightExcerpt } from "components/HighlightExcerpt";
import React from "react";

interface HighlightDetailExcerptSectionProps {
  excerpt: string;
  highlightId: string;
}

export const HighlightDetailExcerptSection: React.FunctionComponent<
  HighlightDetailExcerptSectionProps
> = ({ excerpt, highlightId }) => {
  return <HighlightExcerpt excerpt={excerpt} dataHighlightId={highlightId} />;
};
