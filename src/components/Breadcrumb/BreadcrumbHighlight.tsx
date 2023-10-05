import { HighlightBreadcrumb } from "components/DiptychContext";
import React from "react";
import styles from "./Breadcrumb.less";
import cx from "classnames";
import { Card, Typography } from "@mui/material";

interface BreadcrumbHighlightProps {
  breadcrumb: HighlightBreadcrumb;
}

export const BreadcrumbHighlight: React.FunctionComponent<
  BreadcrumbHighlightProps
> = ({ breadcrumb }) => {
  return (
    <div className={cx(styles["breadcrumb"], styles["highlight-breadcrumb"])}>
      <Card variant="translucent">
        <Typography>highlight</Typography>
      </Card>
    </div>
  );
};
