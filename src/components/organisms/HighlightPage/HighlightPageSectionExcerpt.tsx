import { BlurbExcerpt } from "components/molecules/BlurbExcerpt";
import React, { FunctionComponent } from "react";

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
