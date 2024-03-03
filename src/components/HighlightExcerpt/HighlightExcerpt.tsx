import cx from "classnames";
import { Paper } from "@mui/material";
import React from "react";
import styles from "./HighlightExcerpt.less";
import { gql } from "util/apollo";
import { useQuery } from "@apollo/client";

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

export const HighlightExcerpt: React.FunctionComponent<
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
    <Paper
      sx={{ borderRadius: "0" }}
      className={cx(paperClassName, styles["excerpt-paper"])}
      data-highlightid={highlightId}
    >
      <div
        className={cx(
          divClassName,
          styles["excerpt-div"],
          truncate && styles["truncate"]
        )}
        style={{ WebkitLineClamp: truncateLineClamp }}
        dangerouslySetInnerHTML={{ __html: data?.highlight?.excerpt ?? "" }}
      />
    </Paper>
  );
};
