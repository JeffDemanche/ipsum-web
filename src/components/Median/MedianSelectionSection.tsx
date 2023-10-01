import React, { useContext, useMemo } from "react";
import { HighlightSelectionContext } from "components/HighlightSelectionContext";
import styles from "./MedianSelectionSection.less";
import { MedianHighlightBox } from "components/MedianHighlightBox";
import { useHighlightSearch } from "util/highlight-search";
import SimpleBar from "simplebar-react";

export const MedianSelectionSection: React.FunctionComponent = () => {
  const { selectedHighlightId } = useContext(HighlightSelectionContext);

  const { searchResults } = useHighlightSearch({
    highlightId: selectedHighlightId,
  });

  const highlightBoxes = useMemo(() => {
    if (!searchResults || !selectedHighlightId) {
      return null;
    } else {
      return searchResults.map((highlight, i) => (
        <MedianHighlightBox key={i} highlightId={highlight.id} />
      ));
    }
  }, [searchResults, selectedHighlightId]);

  return (
    <SimpleBar className={styles["selection-section"]}>
      {highlightBoxes}
    </SimpleBar>
  );
};
