import { BlurbExcerpt } from "components/molecules/BlurbExcerpt";
import type { FunctionComponent } from "react";
import React from "react";

import styles from "./HighlightPage.less";

interface HighlightPageSectionExcerptProps {
  highlightId: string;
  htmlString: string;
  highlightHue: number;
}

export const HighlightPageSectionExcerpt: FunctionComponent<
  HighlightPageSectionExcerptProps
> = ({ highlightId, htmlString, highlightHue }) => {
  return (
    <div className={styles["page-section"]}>
      <BlurbExcerpt
        htmlString={htmlString}
        highlightHue={highlightHue}
        highlightId={highlightId}
      />
    </div>
  );
};
