import React from "react";
import styles from "./Breadcrumb.less";
import { HighlightExcerptConnected } from "components/HighlightExcerpt";
import { HighlightBreadcrumb } from "./types";

interface BreadcrumbHighlightProps {
  breadcrumb: HighlightBreadcrumb;
}

export const BreadcrumbHighlight: React.FunctionComponent<
  BreadcrumbHighlightProps
> = ({ breadcrumb }) => {
  return (
    <HighlightExcerptConnected
      truncate
      truncateLineClamp={2}
      paperClassName={styles["breadcrumb-highlight-excerpt"]}
      divClassName={styles["excerpt-top-div"]}
      highlightId={breadcrumb.highlightId}
    />
  );
};
