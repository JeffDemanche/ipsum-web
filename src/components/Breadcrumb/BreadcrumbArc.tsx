import { Card } from "@mui/material";
import { ArcChipConnected } from "components/ArcChip";
import { ArcBreadcrumb } from "components/DiptychContext";
import React from "react";
import styles from "./Breadcrumb.less";

interface BreadcrumbArcProps {
  breadcrumb: ArcBreadcrumb;
}

export const BreadcrumbArc: React.FunctionComponent<BreadcrumbArcProps> = ({
  breadcrumb,
}) => {
  return (
    <div className={styles["breadcrumb"]}>
      <Card variant="outlined" className={styles["breadcrumb-card"]}>
        <ArcChipConnected arcId={breadcrumb.arcId} />
      </Card>
    </div>
  );
};
