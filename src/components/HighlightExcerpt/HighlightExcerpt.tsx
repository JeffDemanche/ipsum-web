import cx from "classnames";
import { Paper } from "@mui/material";
import React, { useEffect } from "react";
import styles from "./HighlightExcerpt.less";
import { gql } from "util/apollo";
import { useQuery } from "@apollo/client";

interface HighlightExcerptProps {
  highlightId: string;
  className?: string;
  charLimit?: number;
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
> = ({ highlightId, className, charLimit }) => {
  const { data } = useQuery(HighlightExcerptQuery, {
    variables: { highlightId },
  });

  const ref = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (data?.highlight?.excerpt && ref.current) {
      ref.current.innerHTML = data.highlight.excerpt;
    }
  }, [data.highlight.excerpt]);

  return (
    <Paper
      sx={{ borderRadius: "0" }}
      className={cx(className, styles["excerpt"])}
      data-highlightid={highlightId}
    >
      <div ref={ref} />
    </Paper>
  );
};
