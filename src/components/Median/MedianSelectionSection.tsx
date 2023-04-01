import React, { useContext, useMemo } from "react";
import { HighlightSelectionContext } from "components/HighlightSelectionContext";
import styles from "./MedianSelectionSection.less";
import { MedianHighlightBox } from "components/MedianHighlightBox";
import { useHighlightSearch } from "util/highlight-search";

export const MedianSelectionSection: React.FunctionComponent = () => {
  const { selectedHighlightIds } = useContext(HighlightSelectionContext);

  const { searchResults } = useHighlightSearch({
    highlightId: selectedHighlightIds[0],
  });

  const highlightBoxes = useMemo(() => {
    if (selectedHighlightIds.length !== 1) return null;
    else
      return searchResults.map((highlight) => (
        <MedianHighlightBox key={highlight.id} highlightId={highlight.id} />
      ));
  }, [searchResults, selectedHighlightIds]);

  return <div className={styles["selection-section"]}>{highlightBoxes}</div>;
};
