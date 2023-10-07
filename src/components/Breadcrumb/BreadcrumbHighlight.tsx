import { HighlightBreadcrumb } from "components/DiptychContext";
import React from "react";
import styles from "./Breadcrumb.less";
import cx from "classnames";
import { HighlightBox } from "components/HighlightBox";

interface BreadcrumbHighlightProps {
  breadcrumb: HighlightBreadcrumb;
}

export const BreadcrumbHighlight: React.FunctionComponent<
  BreadcrumbHighlightProps
> = ({ breadcrumb }) => {
  return (
    <div className={cx(styles["breadcrumb"], styles["highlight-breadcrumb"])}>
      <HighlightBox variant="collapsed" highlightId={breadcrumb.highlightId} />
    </div>
  );
};
