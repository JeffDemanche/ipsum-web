import { RelationsTable } from "components/molecules/RelationsTable";
import React, { FunctionComponent } from "react";

import styles from "./HighlightPage.less";

interface HighlightPageSectionAttributesProps {
  highlightId: string;
  relations: React.ComponentProps<typeof RelationsTable>["relations"];

  relationTableProps: Pick<
    React.ComponentProps<typeof RelationsTable>,
    "onCreateRelation" | "onDeleteRelation" | "arcResults" | "onArcSearch"
  >;
}

export const HighlightPageSectionAttributes: FunctionComponent<
  HighlightPageSectionAttributesProps
> = ({ highlightId, relations, relationTableProps }) => {
  return (
    <div className={styles["page-section"]}>
      <RelationsTable
        expanded
        relations={relations}
        editable
        subjectType="Highlight"
        subjectId={highlightId}
        {...relationTableProps}
      />
    </div>
  );
};
