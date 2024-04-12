import React from "react";

import styles from "./Median.less";
import { MedianSearchSection } from "./MedianSearchSection";

export const Median: React.FunctionComponent = () => {
  return (
    <div className={styles["median"]}>
      <div className={styles["median-absolute"]}>
        <MedianSearchSection />
      </div>
    </div>
  );
};
