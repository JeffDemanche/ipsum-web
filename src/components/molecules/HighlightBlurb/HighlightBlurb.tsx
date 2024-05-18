import React from "react";

import { BlurbWrapper } from "../BlurbWrapper/BlurbWrapper";
import { HighlightTag } from "../HighlightTag";
import { RelationsTable } from "../RelationsTable/RelationsTable";
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
