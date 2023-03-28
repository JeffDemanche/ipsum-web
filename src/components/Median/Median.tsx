import React from "react";
import styles from "./Median.less";
import { MedianBreadcrumbsSection } from "./MedianBreadcrumbsSection";
import { MedianSelectionSection } from "./MedianSelectionSection";

export const Median: React.FunctionComponent = () => {
  return (
    <div className={styles["median"]}>
      <MedianBreadcrumbsSection />
      {/* <Divider /> */}
      <MedianSelectionSection />
    </div>
  );
};
