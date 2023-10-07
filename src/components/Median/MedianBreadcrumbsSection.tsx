import { Breadcrumb } from "components/Breadcrumb";
import { DiptychContext } from "components/DiptychContext";
import React, { useContext } from "react";
import styles from "./MedianBreadcrumbsSection.less";

export const MedianBreadcrumbsSection: React.FunctionComponent = () => {
  const { orderedBreadcrumbs } = useContext(DiptychContext);

  return (
    <div className={styles["breadcrumbs-section"]}>
      {orderedBreadcrumbs.map((breadcrumb, i) => {
        return <Breadcrumb key={i} breadcrumb={breadcrumb} />;
      })}
    </div>
  );
};
