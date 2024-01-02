import React from "react";
import { URLSearchCriteria } from "util/url";
import styles from "./HighlightSearchCriteriaPanel.less";

export interface HighlightSearchCriteriaPanelProps {
  searchCriteria: URLSearchCriteria;
  isUserSearch: boolean;
}

export const HighlightSearchCriteriaPanel: React.FC<
  HighlightSearchCriteriaPanelProps
> = ({ searchCriteria, isUserSearch }) => {
  return (
    <div className={styles["highlight-search-criteria-panel"]}>
      Search criteria
    </div>
  );
};
