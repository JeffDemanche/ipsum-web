import React, { useContext, useMemo } from "react";
import { HighlightSelectionContext } from "components/HighlightSelectionContext";
import styles from "./MedianSelectionSection.less";
import { HighlightBox } from "components/HighlightBox";
import { useHighlightSearch } from "util/highlight-search";
import SimpleBar from "simplebar-react";
import { DiptychContext } from "components/DiptychContext";

export const MedianSelectionSection: React.FunctionComponent = () => {
  const { setTopHighlightTo, selectedHighlightId } = useContext(DiptychContext);

  const { searchResults } = useHighlightSearch({
    highlightId: selectedHighlightId,
  });

  const { hoveredHighlightIds, setHoveredHighlightIds } = useContext(
    HighlightSelectionContext
  );

  const highlightBoxes = useMemo(() => {
    if (!searchResults || !selectedHighlightId) {
      return null;
    } else {
      return searchResults.map((highlight, i) => (
        <HighlightBox
          key={i}
          highlightId={highlight.id}
          hovered={(hoveredHighlightIds ?? []).includes(highlight.id)}
          onHover={(hovered) => {
            if (hovered) {
              setHoveredHighlightIds((prev) => [...(prev ?? []), highlight.id]);
            } else {
              setHoveredHighlightIds((prev) =>
                (prev ?? []).filter((id) => id !== highlight.id)
              );
            }
          }}
          selected={highlight.id === selectedHighlightId}
          onSelect={(selected, highlightDay) => {
            if (selected) {
              setTopHighlightTo(
                highlight.id,
                highlightDay.toString("url-format")
              );
            }
          }}
        />
      ));
    }
  }, [
    hoveredHighlightIds,
    searchResults,
    selectedHighlightId,
    setHoveredHighlightIds,
    setTopHighlightTo,
  ]);

  return (
    <SimpleBar className={styles["selection-section"]}>
      {highlightBoxes}
    </SimpleBar>
  );
};
