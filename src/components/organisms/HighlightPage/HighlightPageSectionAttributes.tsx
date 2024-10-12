import { RelationsTable } from "components/molecules/RelationsTable";
import React, { FunctionComponent } from "react";

import styles from "./HighlightPage.less";

interface HighlightPageSectionAttributesProps {
  relations: React.ComponentProps<typeof RelationsTable>["relations"];
  onCreateRelation: React.ComponentProps<
    typeof RelationsTable
  >["onCreateRelation"];
  onDeleteRelation: React.ComponentProps<
    typeof RelationsTable
  >["onDeleteRelation"];
  onArcSearch: React.ComponentProps<typeof RelationsTable>["onArcSearch"];
  arcResults: React.ComponentProps<typeof RelationsTable>["arcResults"];
}

export const HighlightPageSectionAttributes: FunctionComponent<
  HighlightPageSectionAttributesProps
> = ({
  relations,
  onCreateRelation,
  onDeleteRelation,
  onArcSearch,
  arcResults,
}) => {
  return (
    <div className={styles["page-section"]}>
      <RelationsTable
        expanded
        relations={relations}
        editable
        onCreateRelation={onCreateRelation}
        onDeleteRelation={onDeleteRelation}
        onArcSearch={onArcSearch}
        arcResults={arcResults}
      />
    </div>
  );
};
