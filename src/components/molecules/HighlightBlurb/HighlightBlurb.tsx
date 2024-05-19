import { BlurbWrapper } from "components/molecules/BlurbWrapper";
import { HighlightTag } from "components/molecules/HighlightTag";
import { RelationsTable } from "components/molecules/RelationsTable";
import React from "react";

import styles from "./HighlightBlurb.less";

interface HighlightBlurbProps {
  highlightTagProps: {
    objectText: string;
    hue: number;
    highlightNumber: number;
    arcNames: string[];
  };
  relations: React.ComponentProps<typeof RelationsTable>["relations"];
}

export const HighlightBlurb: React.FunctionComponent<HighlightBlurbProps> = ({
  highlightTagProps,
  relations,
}) => {
  return (
    <BlurbWrapper collapsible>
      <div className={styles["blurb-content"]}>
        <HighlightTag fontSize="small" {...highlightTagProps} />
        <div>excerpt text</div>
        <RelationsTable expanded relations={relations} />
      </div>
    </BlurbWrapper>
  );
};
