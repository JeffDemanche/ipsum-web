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
    highlightObject:
      | { type: "daily_journal"; entryKey: string }
      | { type: "arc"; arcId: string }
      | { type: "comment"; commentId: string; highlightId: string };
  }[];
  onHighlightClick?: (highlightId: string) => void;
  onHighlightDailyJournalClick?: (entryKey: string) => void;
  onHighlightArcClick?: (arcId: string) => void;
  onHighlightCommentClick?: (commentId: string, highlightId: string) => void;
  onHighlightDelete?: (highlightId: string) => void;

  relationsTableProps: Pick<
    React.ComponentProps<typeof RelationsTable>,
    | "onCreateRelation"
    | "onDeleteRelation"
    | "arcResults"
    | "onArcSearch"
    | "onArcCreate"
  >;
}

export const BrowserHighlightsTab: React.FunctionComponent<
  BrowserHighlightsTabProps
> = ({
  optionsDrawerProps,
  highlights,
  onHighlightClick,
  onHighlightDailyJournalClick,
  onHighlightArcClick,
  onHighlightCommentClick,
  onHighlightDelete,
  relationsTableProps,
}) => {
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
              <Type variant="sans" size="x-small" weight="light" underline>
                {day.toString("entry-printed-date-nice-with-year")}
              </Type>
              <div className={styles["day-group-blurbs"]}>
                {highlights.map((highlight) => {
                  return (
                    <HighlightBlurb
                      key={highlight.highlightProps.highlightId}
                      highlightProps={highlight.highlightProps}
                      excerptProps={highlight.excerptProps}
                      relations={highlight.relationsProps}
                      onHighlightClick={() => {
                        onHighlightClick?.(
                          highlight.highlightProps.highlightId
                        );
                      }}
                      onDelete={() => {
                        onHighlightDelete?.(
                          highlight.highlightProps.highlightId
                        );
                      }}
                      onHighlightObjectClick={() => {
                        switch (highlight.highlightObject.type) {
                          case "daily_journal":
                            onHighlightDailyJournalClick?.(
                              highlight.highlightObject.entryKey
                            );
                            break;
                          case "arc":
                            onHighlightArcClick?.(
                              highlight.highlightObject.arcId
                            );
                            break;
                          case "comment":
                            onHighlightCommentClick?.(
                              highlight.highlightObject.commentId,
                              highlight.highlightObject.highlightId
                            );
                        }
                      }}
                      relationsTableProps={relationsTableProps}
                    />
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
