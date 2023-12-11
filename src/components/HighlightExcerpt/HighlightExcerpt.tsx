import cx from "classnames";
import { Paper } from "@mui/material";
import React from "react";
import styles from "./HighlightExcerpt.less";
import { useExcerpt } from "./useExcerpt";

interface HighlightExcerptProps {
  highlightId: string;
  className?: string;
  charLimit?: number;
}

export const HighlightExcerpt: React.FunctionComponent<
  HighlightExcerptProps
> = ({ highlightId, className, charLimit }) => {
  const { ref } = useExcerpt({
    highlightId,
    charLimit,
  });

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
