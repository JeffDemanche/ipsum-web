import { RelationsTableConnectedProps } from "components/hooks/use-arc-relations-table-connected";
import { RelationsTable } from "components/molecules/RelationsTable";
import React, { FunctionComponent } from "react";

import styles from "./HighlightPage.less";

interface HighlightPageSectionAttributesProps {
  highlightId: string;
  relations: React.ComponentProps<typeof RelationsTable>["relations"];

  relationTableProps: RelationsTableConnectedProps;
}

export const HighlightPageSectionAttributes: FunctionComponent<
  HighlightPageSectionAttributesProps
> = ({ highlightId, relations, relationTableProps }) => {
  return (
    <div className={styles["page-section"]}>
      <div className={styles["action-buttons"]}>actions</div>
      <RelationsTable
        expanded
        relations={relations}
        editable
        subjectType="Highlight"
        subjectId={highlightId}
        allowCreation
        {...relationTableProps}
      />
    </div>
  );
};
