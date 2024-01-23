import React, { useContext, useMemo } from "react";
import styles from "./MedianSearchSection.less";
import { useHighlightSearch } from "util/search";
import { HighlightsList } from "components/HighlightsList";
import { HighlightSearchCriteriaPanel } from "components/HighlightSearchCriteriaPanel";
import { DiptychContext } from "components/DiptychContext";

export const MedianSearchSection: React.FunctionComponent = () => {
  const { isUserSearch, searchCriteria, searchResults } = useHighlightSearch();

  const { selectedHighlightId } = useContext(DiptychContext);

  const highlightIds = useMemo(() => {
    const results = searchResults?.map((highlight) => highlight.id) ?? [];
    if (!results.includes(selectedHighlightId)) {
      results.unshift(selectedHighlightId);
    }
    return results;
  }, [searchResults, selectedHighlightId]);

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
