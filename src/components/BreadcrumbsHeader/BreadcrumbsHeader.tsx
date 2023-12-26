import { Breadcrumb } from "components/Breadcrumb";
import { DiptychContext } from "components/DiptychContext";
import React, { useContext } from "react";
import styles from "./BreadcrumbsHeader.less";

export const BreadcrumbsHeader: React.FunctionComponent = () => {
  const { orderedBreadcrumbs } = useContext(DiptychContext);
  return (
    <div className={styles["breadcrumbs-header"]}>
      {orderedBreadcrumbs.map((breadcrumb, i) => {
        return <Breadcrumb key={i} breadcrumb={breadcrumb} />;
      })}
    </div>
  );
};
