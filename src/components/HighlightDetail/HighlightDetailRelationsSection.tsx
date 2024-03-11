import { HighlightRelationsTable } from "components/HighlightRelationsTable";
import React from "react";

interface HighlightDetailRelationsSectionProps {
  highlightId: string;
}

export const HighlightDetailRelationsSection: React.FunctionComponent<
  HighlightDetailRelationsSectionProps
> = ({ highlightId }) => {
  return <HighlightRelationsTable highlightId={highlightId} showPlusButton />;
};
