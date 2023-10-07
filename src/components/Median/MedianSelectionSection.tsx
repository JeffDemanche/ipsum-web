import React, { useContext, useMemo } from "react";
import { HighlightSelectionContext } from "components/HighlightSelectionContext";
import styles from "./MedianSelectionSection.less";
import { HighlightBox } from "components/HighlightBox";
import { useHighlightSearch } from "util/highlight-search";
import SimpleBar from "simplebar-react";
import { useModifySearchParams } from "util/url";

export const MedianSelectionSection: React.FunctionComponent = () => {
  const { selectedHighlightId } = useContext(HighlightSelectionContext);

  const { searchResults } = useHighlightSearch({
    highlightId: selectedHighlightId,
  });

  const modifySearchParams = useModifySearchParams<"journal">();

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
              modifySearchParams((searchParams) => ({
                ...searchParams,
                layers: [
                  {
                    ...searchParams.layers[0],
                    focusedDate: highlightDay.toString("url-format"),
                  },
                  ...searchParams.layers.slice(1),
                ],
                highlight: highlight.id,
              }));
            }
          }}
        />
      ));
    }
  }, [
    hoveredHighlightIds,
    modifySearchParams,
    searchResults,
    selectedHighlightId,
    setHoveredHighlightIds,
  ]);

  return (
    <SimpleBar className={styles["selection-section"]}>
      {highlightBoxes}
    </SimpleBar>
  );
};
