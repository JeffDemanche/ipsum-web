import React, { useMemo } from "react";
import styles from "./MedianSearchSection.less";
import { useHighlightSearch } from "util/search";
import { HighlightsList } from "components/HighlightsList";

export const MedianSearchSection: React.FunctionComponent = () => {
  const { searchResults } = useHighlightSearch();

  const highlightIds = useMemo(() => {
    return searchResults?.map((highlight) => highlight.id) ?? [];
  }, [searchResults]);

  return (
    <div className={styles["search-section"]}>
      <div className={styles["results"]}>
        <HighlightsList highlightIds={highlightIds} />
      </div>
    </div>
  );
};
