import type { RelationsTableConnectedProps } from "components/hooks/use-arc-relations-table-connected";
import type { HighlightFunctionButtonsConnectedProps } from "components/hooks/use-highlight-function-buttons-connected";
import type { HighlightSRSButtonsConnectedProps } from "components/hooks/use-highlight-srs-buttons-connected";
import { HighlightFunctionButtons } from "components/molecules/HighlightFunctionButtons";
import { HighlightSRSButtons } from "components/molecules/HighlightSRSButtons";
import { RelationsTable } from "components/molecules/RelationsTable";
import type { FunctionComponent } from "react";
import React from "react";

import styles from "./HighlightPage.less";

interface HighlightPageSectionAttributesProps {
  highlightId: string;
  relations: React.ComponentProps<typeof RelationsTable>["relations"];

  highlightSRSButtonsProps: HighlightSRSButtonsConnectedProps;
  highlightFunctionButtonsProps: HighlightFunctionButtonsConnectedProps;
  relationTableProps: RelationsTableConnectedProps;
}

export const HighlightPageSectionAttributes: FunctionComponent<
  HighlightPageSectionAttributesProps
> = ({
  highlightId,
  relations,
  highlightSRSButtonsProps,
  highlightFunctionButtonsProps,
  relationTableProps,
}) => {
  return (
    <div className={styles["page-section"]}>
      <div className={styles["action-buttons"]}>
        <HighlightSRSButtons
          orientation="horizontal"
          {...highlightSRSButtonsProps}
        />
        <div className={styles["vertical-divider"]}></div>
        <HighlightFunctionButtons
          orientation="horizontal"
          {...highlightFunctionButtonsProps}
        />
      </div>
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
