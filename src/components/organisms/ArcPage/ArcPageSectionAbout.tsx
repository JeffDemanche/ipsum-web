import React, { FunctionComponent } from "react";

import { Entry } from "../Entry";
import styles from "./ArcPage.less";

interface ArcPageSectionAboutProps {
  highlights: React.ComponentProps<typeof Entry>["highlights"];
  htmlString: string;
}

export const ArcPageSectionAbout: FunctionComponent<
  ArcPageSectionAboutProps
> = ({ highlights, htmlString }) => {
  return (
    <div className={styles["page-section"]}>
      <Entry highlights={highlights} editable htmlString={htmlString} />
    </div>
  );
};
