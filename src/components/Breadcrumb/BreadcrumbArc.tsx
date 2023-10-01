import { ArcBreadcrumb } from "components/DiptychContext";
import React from "react";
import styles from "./Breadcrumb.less";

interface BreadcrumbArcProps {
  breadcrumb: ArcBreadcrumb;
}

export const BreadcrumbArc: React.FunctionComponent<BreadcrumbArcProps> = ({
  breadcrumb,
}) => {
  return <div className={styles["breadcrumb"]}>arc</div>;
};
