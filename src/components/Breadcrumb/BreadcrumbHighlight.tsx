import { HighlightBreadcrumb } from "components/DiptychContext";
import React from "react";
import styles from "./Breadcrumb.less";
import cx from "classnames";
import { Card } from "@mui/material";
import { HighlightExcerpt } from "components/HighlightExcerpt";

interface BreadcrumbHighlightProps {
  breadcrumb: HighlightBreadcrumb;
}

export const BreadcrumbHighlight: React.FunctionComponent<
  BreadcrumbHighlightProps
> = ({ breadcrumb }) => {
  return (
    <div className={cx(styles["breadcrumb"], styles["highlight-breadcrumb"])}>
      <Card variant="outlined" className={styles["breadcrumb-card"]}>
        <HighlightExcerpt
          truncate
          truncateLineClamp={2}
          paperClassName={styles["breadcrumb-highlight-excerpt"]}
          divClassName={styles["excerpt-top-div"]}
          highlightId={breadcrumb.highlightId}
        />
      </Card>
    </div>
  );
};
