import { HighlightBreadcrumb } from "components/DiptychContext";
import React from "react";
import styles from "./Breadcrumb.less";
import cx from "classnames";
import { Typography } from "@mui/material";

interface BreadcrumbHighlightProps {
  breadcrumb: HighlightBreadcrumb;
}

export const BreadcrumbHighlight: React.FunctionComponent<
  BreadcrumbHighlightProps
> = ({ breadcrumb }) => {
  return (
    <div className={cx(styles["breadcrumb"], styles["highlight-breadcrumb"])}>
      <Typography>highlight</Typography>
    </div>
  );
};
