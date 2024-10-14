import { RelationsTable } from "components/molecules/RelationsTable";
import React, { FunctionComponent } from "react";

import styles from "./ArcPage.less";

interface ArcPageSectionRelationsProps {
  arcId: string;
  relations: React.ComponentProps<typeof RelationsTable>["relations"];
  relationsTableProps: Pick<
    React.ComponentProps<typeof RelationsTable>,
    | "onCreateRelation"
    | "onDeleteRelation"
    | "arcResults"
    | "onArcSearch"
    | "onArcClick"
  >;
}

export const ArcPageSectionRelations: FunctionComponent<
  ArcPageSectionRelationsProps
> = ({ arcId, relations, relationsTableProps }) => {
  return (
    <div className={styles["page-section"]}>
      <RelationsTable
        editable
        expanded
        relations={relations}
        subjectId={arcId}
        subjectType="Arc"
        {...relationsTableProps}
      />
    </div>
  );
};
