import React, { FunctionComponent } from "react";

import styles from "./HighlightPage.less";

interface HighlightPageSectionCommentsProps {}

export const HighlightPageSectionComments: FunctionComponent<
  HighlightPageSectionCommentsProps
> = () => {
  return <div className={styles["page-section"]}>comments</div>;
};
