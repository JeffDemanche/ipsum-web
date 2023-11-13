import cx from "classnames";
import { useQuery } from "@apollo/client";
import { Paper } from "@mui/material";
import React, { useCallback, useEffect, useMemo, useRef } from "react";
import { gql } from "util/apollo";
import styles from "./HighlightExcerpt.less";
import { useExcerpt } from "./useExcerpt";

interface HighlightExcerptProps {
  highlightId: string;
  className?: string;
  charLimit?: number;
}

export const HighlightExcerptQuery = gql(`
  query HighlightExcerpt($highlightId: ID!) {
    highlights(ids: [$highlightId]) {
      id
      entry {
        entryKey
        htmlString
      }
    }
  }
`);

export const HighlightExcerpt: React.FunctionComponent<
  HighlightExcerptProps
> = ({ highlightId, className, charLimit }) => {
  const {
    data: { highlights },
  } = useQuery(HighlightExcerptQuery, { variables: { highlightId } });
  const highlight = highlights?.[0];

  const entry = highlight?.entry;

  const { ref } = useExcerpt({
    domString: entry?.htmlString,
    highlightId: highlight.id,
    charLimit,
  });

  return (
    <Paper
      sx={{ borderRadius: "0" }}
      className={cx(className, styles["excerpt"])}
    >
      <div ref={ref} />
    </Paper>
  );
};
