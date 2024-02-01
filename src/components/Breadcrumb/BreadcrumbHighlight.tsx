import { HighlightBreadcrumb } from "components/DiptychContext";
import React from "react";
import styles from "./Breadcrumb.less";
import cx from "classnames";
import { HighlightBox } from "components/HighlightBox";
import { Card } from "@mui/material";
import { gql } from "util/apollo";

interface BreadcrumbHighlightProps {
  breadcrumb: HighlightBreadcrumb;
}

const BreadcrumbHighlightQuery = gql(`
  query BreadcrumbHighlightQuery($highlightId: ID!) {
    highlight(id: $highlightId) {
      id
      excerpt
    }
  }
`);

export const BreadcrumbHighlight: React.FunctionComponent<
  BreadcrumbHighlightProps
> = ({ breadcrumb }) => {
  return (
    <div className={cx(styles["breadcrumb"], styles["highlight-breadcrumb"])}>
      <Card variant="outlined" className={styles["breadcrumb-card"]}>
        <HighlightBox
          variant="collapsed"
          highlightId={breadcrumb.highlightId}
        />
      </Card>
    </div>
  );
};
