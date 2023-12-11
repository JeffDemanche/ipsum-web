import { Divider } from "@mui/material";
import React from "react";
import styles from "./Median.less";
import { MedianBreadcrumbsSection } from "./MedianBreadcrumbsSection";
import { MedianSearchSection } from "./MedianSearchSection";

export const Median: React.FunctionComponent = () => {
  return (
    <div className={styles["median"]}>
      <div className={styles["median-absolute"]}>
        <MedianBreadcrumbsSection />
        <Divider />
        <MedianSearchSection />
      </div>
    </div>
  );
};
