import { useQuery } from "@apollo/client";
import { Card } from "@mui/material";
import { ArcTag } from "components/ArcTag";
import { ArcBreadcrumb } from "components/DiptychContext";
import React from "react";
import { gql } from "util/apollo";
import styles from "./Breadcrumb.less";

interface BreadcrumbArcProps {
  breadcrumb: ArcBreadcrumb;
}

const BreadcrumbArcQuery = gql(`
  query BreadcrumbArcQuery($arcId: ID!) {
    arc(id: $arcId) {
      id
      color
    }
  }
`);

export const BreadcrumbArc: React.FunctionComponent<BreadcrumbArcProps> = ({
  breadcrumb,
}) => {
  const { data } = useQuery(BreadcrumbArcQuery, {
    variables: {
      arcId: breadcrumb.arcId,
    },
  });

  return (
    <div className={styles["breadcrumb"]}>
      <Card variant="translucent" className={styles["breadcrumb-card"]}>
        <ArcTag arcForToken={{ type: "from id", id: breadcrumb.arcId }} />
      </Card>
    </div>
  );
};
