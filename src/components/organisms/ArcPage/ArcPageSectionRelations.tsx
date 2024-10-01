import { RelationsTable } from "components/molecules/RelationsTable";
import React, { FunctionComponent } from "react";

import styles from "./ArcPage.less";

interface ArcPageSectionRelationsProps {
  relations: React.ComponentProps<typeof RelationsTable>["relations"];
}

export const ArcPageSectionRelations: FunctionComponent<
  ArcPageSectionRelationsProps
> = ({ relations }) => {
  return (
    <div className={styles["page-section"]}>
      <RelationsTable editable expanded relations={relations} />
    </div>
  );
};
