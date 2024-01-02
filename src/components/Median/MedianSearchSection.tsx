import React, { useMemo } from "react";
import styles from "./MedianSearchSection.less";
import { useHighlightSearch } from "util/search";
import { HighlightsList } from "components/HighlightsList";
import { HighlightSearchCriteriaPanel } from "components/HighlightSearchCriteriaPanel";

export const MedianSearchSection: React.FunctionComponent = () => {
  const { isUserSearch, searchCriteria, searchResults } = useHighlightSearch();

  const highlightIds = useMemo(() => {
    return searchResults?.map((highlight) => highlight.id) ?? [];
  }, [searchResults]);

  return (
    <div className={styles["search-section"]}>
      <HighlightSearchCriteriaPanel
        isUserSearch={isUserSearch}
        searchCriteria={searchCriteria}
      />
      <div className={styles["results"]}>
        <HighlightsList highlightIds={highlightIds} />
      </div>
    </div>
  );
};
