import { useQuery } from "@apollo/client";
import React from "react";
import { gql } from "util/apollo";

import { HighlightExcerpt } from "./HighlightExcerpt";

interface HighlightExcerptProps {
  highlightId: string;
  paperClassName?: string;
  divClassName?: string;

  /**
   * Truncate will apply an ellipsis to excerpt text based on the width of the
   * paper component.
   */
  truncate?: boolean;

  /**
   * If truncate is true, this will determine the number of lines to display.
   */
  truncateLineClamp?: number;
}

const HighlightExcerptQuery = gql(`
  query HighlightExcerptQuery($highlightId: ID!) {
    highlight(id: $highlightId) {
      id
      excerpt
    }
  }
`);

export const HighlightExcerptConnected: React.FunctionComponent<
  HighlightExcerptProps
> = ({
  highlightId,
  paperClassName,
  divClassName,
  truncate,
  truncateLineClamp,
}) => {
  const { data } = useQuery(HighlightExcerptQuery, {
    variables: { highlightId },
  });
  return (
    <HighlightExcerpt
      excerpt={data?.highlight?.excerpt}
      dataHighlightId={highlightId}
      divClassName={divClassName}
      paperClassName={paperClassName}
      truncate={truncate}
      truncateLineClamp={truncateLineClamp}
    />
  );
};
