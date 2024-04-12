import { Paper } from "@mui/material";
import cx from "classnames";
import React from "react";

import styles from "./HighlightExcerpt.less";

interface HighlightExcerptProps {
  /** Stringified HTML DOM */
  excerpt: string;

  /** Passed as data-highlightid to the container DOM element */
  dataHighlightId: string;

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

export const HighlightExcerpt: React.FunctionComponent<
  HighlightExcerptProps
> = ({
  excerpt,
  dataHighlightId,
  paperClassName,
  divClassName,
  truncate,
  truncateLineClamp,
}) => {
  return (
    <Paper
      sx={{ borderRadius: "0" }}
      className={cx(paperClassName, styles["excerpt-paper"])}
      data-highlightid={dataHighlightId}
    >
      <div
        className={cx(
          divClassName,
          styles["excerpt-div"],
          truncate && styles["truncate"]
        )}
        style={{ WebkitLineClamp: truncateLineClamp }}
        dangerouslySetInnerHTML={{ __html: excerpt ?? "" }}
      />
    </Paper>
  );
};
