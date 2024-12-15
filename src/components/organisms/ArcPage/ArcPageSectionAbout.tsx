import React, { FunctionComponent } from "react";

import { Entry } from "../../molecules/Entry";
import styles from "./ArcPage.less";

interface ArcPageSectionAboutProps {
  arcId: string;
  highlights: React.ComponentProps<typeof Entry>["highlights"];
  htmlString: string;
}

export const ArcPageSectionAbout: FunctionComponent<
  ArcPageSectionAboutProps
> = ({ arcId, highlights, htmlString }) => {
  return (
    <div className={styles["page-section"]}>
      <Entry
        editorNamespace={`arc-${arcId}`}
        highlights={highlights}
        editable
        htmlString={htmlString}
      />
    </div>
  );
};
