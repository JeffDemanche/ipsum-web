import { RelationsTable } from "components/molecules/RelationsTable";
import React, { FunctionComponent } from "react";

import styles from "./HighlightPage.less";

interface HighlightPageSectionAttributesProps {
  relations: React.ComponentProps<typeof RelationsTable>["relations"];
}

export const HighlightPageSectionAttributes: FunctionComponent<
  HighlightPageSectionAttributesProps
> = ({ relations }) => {
  return (
    <div className={styles["page-section"]}>
      <RelationsTable expanded relations={relations} editable />
    </div>
  );
};
