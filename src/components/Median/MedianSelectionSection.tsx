import React, { useContext, useMemo } from "react";
import { HighlightSelectionContext } from "components/HighlightSelectionContext";
import styles from "./MedianSelectionSection.less";
import { MedianHighlightBox } from "components/MedianHighlightBox";
import { useHighlightSearch } from "util/highlight-search";
import SimpleBar from "simplebar-react";

export const MedianSelectionSection: React.FunctionComponent = () => {
  const { selectedHighlightIds } = useContext(HighlightSelectionContext);

  const { searchResults } = useHighlightSearch({
    highlightId: selectedHighlightIds[0],
  });

  console.log(selectedHighlightIds[0]);

  const highlightBoxes = useMemo(() => {
    if (!searchResults || selectedHighlightIds.length !== 1) {
      return null;
    } else {
      return searchResults.map((highlight, i) => (
        <MedianHighlightBox key={i} highlightId={highlight.id} />
      ));
    }
  }, [searchResults, selectedHighlightIds]);

  return (
    <SimpleBar className={styles["selection-section"]}>
      {highlightBoxes}
    </SimpleBar>
  );
};
