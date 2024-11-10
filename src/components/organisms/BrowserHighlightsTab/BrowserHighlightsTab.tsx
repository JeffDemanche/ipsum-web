import { Type } from "components/atoms/Type";
import React from "react";
import { IpsumDay } from "util/dates";

import { HighlightResultsOptionsDrawer } from "../HighlightResultsOptionsDrawer/HighlightResultsOptionsDrawer";
import styles from "./BrowserHighlightsTab.less";

interface BrowserHighlightsTabProps {
  optionsDrawerProps: React.ComponentProps<
    typeof HighlightResultsOptionsDrawer
  >;
  highlightsWithDay: { id: string; day: IpsumDay }[];
  renderHighlight: (highlightId: string) => React.ReactNode;
}

export const BrowserHighlightsTab: React.FunctionComponent<
  BrowserHighlightsTabProps
> = ({ optionsDrawerProps, highlightsWithDay, renderHighlight }) => {
  const groupedHighlights = highlightsWithDay.reduce(
    (acc, highlight) => {
      const day = highlight.day.toString("url-format");
      if (!acc[day]) {
        acc[day] = [];
      }
      acc[day].push(highlight);
      return acc;
    },
    {} as Record<string, (typeof highlightsWithDay)[number][]>
  );

  return (
    <div className={styles["highlights-drawer"]}>
      <HighlightResultsOptionsDrawer {...optionsDrawerProps} />
      <div className={styles["highlight-results"]}>
        {Object.entries(groupedHighlights).map(([dayString, highlights]) => {
          const day = IpsumDay.fromString(dayString, "url-format");

          return (
            <div className={styles["day-group"]} key={dayString}>
              <Type variant="sans" size="x-small" weight="light" underline>
                {day.toString("entry-printed-date-nice-with-year")}
              </Type>
              <div className={styles["day-group-blurbs"]}>
                {highlights.map((highlight) => {
                  return renderHighlight(highlight.id);
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
