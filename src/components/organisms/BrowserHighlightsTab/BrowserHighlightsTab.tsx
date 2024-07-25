import { Type } from "components/atoms/Type";
import { HighlightBlurb } from "components/molecules/HighlightBlurb";
import { RelationsTable } from "components/molecules/RelationsTable";
import React from "react";
import { IpsumDay } from "util/dates";

import { HighlightResultsOptionsDrawer } from "../HighlightResultsOptionsDrawer/HighlightResultsOptionsDrawer";
import styles from "./BrowserHighlightsTab.less";

interface BrowserHighlightsTabProps {
  optionsDrawerProps: React.ComponentProps<
    typeof HighlightResultsOptionsDrawer
  >;
  highlights: {
    day: IpsumDay;
    highlightProps: React.ComponentProps<
      typeof HighlightBlurb
    >["highlightProps"];
    excerptProps: React.ComponentProps<typeof HighlightBlurb>["excerptProps"];
    relationsProps: React.ComponentProps<typeof RelationsTable>["relations"];
  }[];
}

export const BrowserHighlightsTab: React.FunctionComponent<
  BrowserHighlightsTabProps
> = ({ optionsDrawerProps, highlights }) => {
  const groupedHighlights = highlights.reduce(
    (acc, highlight) => {
      const day = highlight.day.toString("url-format");
      if (!acc[day]) {
        acc[day] = [];
      }
      acc[day].push(highlight);
      return acc;
    },
    {} as Record<string, (typeof highlights)[number][]>
  );

  return (
    <div className={styles["highlights-drawer"]}>
      <HighlightResultsOptionsDrawer {...optionsDrawerProps} />
      <div className={styles["highlight-results"]}>
        {Object.entries(groupedHighlights).map(([dayString, highlights]) => {
          const day = IpsumDay.fromString(dayString, "url-format");

          return (
            <div className={styles["day-group"]} key={dayString}>
              <Type variant="serif" size="small">
                {day.toString("entry-printed-date-nice-with-year")}
              </Type>
              {highlights.map((highlight) => (
                <HighlightBlurb
                  key={highlight.highlightProps.highlightId}
                  highlightProps={highlight.highlightProps}
                  excerptProps={highlight.excerptProps}
                  relations={highlight.relationsProps}
                />
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
};
