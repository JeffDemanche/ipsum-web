import React, { useCallback, useContext, useMemo } from "react";
import { HighlightSelectionContext } from "components/HighlightSelectionContext";
import styles from "./MedianSearchSection.less";
import { useHighlightSearch } from "util/search";
import { DiptychContext } from "components/DiptychContext";
import { IpsumDay } from "util/dates";
import { HighlightsList } from "components/HighlightsList";

export const MedianSearchSection: React.FunctionComponent = () => {
  const {
    topLayer,
    setTopHighlightFrom,
    setTopHighlightTo,
    selectedHighlightId,
  } = useContext(DiptychContext);

  const { searchResults } = useHighlightSearch();

  const { hoveredHighlightIds, setHoveredHighlightIds } = useContext(
    HighlightSelectionContext
  );

  const onHighlightSelected = useCallback(
    (selected: boolean, highlightDay: IpsumDay, highlightId: string) => {
      if (topLayer?.highlightFrom) {
        setTopHighlightTo(highlightId, highlightDay.toString("url-format"));
      } else if (topLayer) {
        setTopHighlightFrom(highlightId, highlightDay.toString("url-format"));
      }
    },
    [setTopHighlightFrom, setTopHighlightTo, topLayer]
  );

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
