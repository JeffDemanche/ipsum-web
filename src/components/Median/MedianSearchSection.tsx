import React, { useCallback, useContext, useMemo } from "react";
import { HighlightSelectionContext } from "components/HighlightSelectionContext";
import styles from "./MedianSearchSection.less";
import { HighlightBox } from "components/HighlightBox";
import { useHighlightSearch } from "util/search";
import { DiptychContext } from "components/DiptychContext";
import { IpsumDay } from "util/dates";
import { MonthlyPaginatedList } from "components/MonthlyPaginatedList";

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

  const highlightBoxes = useMemo(() => {
    if (!searchResults) {
      return null;
    } else {
      return searchResults?.map((highlight) => ({
        id: highlight.id,
        day: IpsumDay.fromString(highlight.entry.date, "iso"),
        element: (
          <HighlightBox
            key={highlight.id}
            highlightId={highlight.id}
            hovered={(hoveredHighlightIds ?? []).includes(highlight.id)}
            onHover={(hovered) => {
              if (hovered) {
                setHoveredHighlightIds((prev) => [
                  ...(prev ?? []),
                  highlight.id,
                ]);
              } else {
                setHoveredHighlightIds((prev) =>
                  (prev ?? []).filter((id) => id !== highlight.id)
                );
              }
            }}
            selected={highlight.id === selectedHighlightId}
            onSelect={(selected, highlightDay) => {
              onHighlightSelected(selected, highlightDay, highlight.id);
            }}
          />
        ),
      }));
    }
  }, [
    hoveredHighlightIds,
    onHighlightSelected,
    searchResults,
    selectedHighlightId,
    setHoveredHighlightIds,
  ]);

  return (
    <MonthlyPaginatedList
      rangeMode="month"
      elements={highlightBoxes?.map((box, i) => ({
        index: i,
        key: box.id,
        content: box.element,
        day: box.day,
      }))}
    />
  );
};
