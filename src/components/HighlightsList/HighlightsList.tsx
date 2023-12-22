import { useQuery } from "@apollo/client";
import { Typography } from "@mui/material";
import { DiptychContext } from "components/DiptychContext";
import { HighlightBox } from "components/HighlightBox";
import { HighlightSelectionContext } from "components/HighlightSelectionContext";
import React, { useContext, useMemo } from "react";
import { gql } from "util/apollo";
import { IpsumDay } from "util/dates";
import styles from "./HighlightsList.less";

interface HighlightsListProps {
  highlightIds: string[];
}

const HighlightsListQuery = gql(`
  query HighlightsList($highlightIds: [ID!]!) {
    highlights(ids: $highlightIds) {
      id
      entry {
        entryKey
        date
      }
    }
  }
`);

export const HighlightsList: React.FunctionComponent<HighlightsListProps> = ({
  highlightIds,
}) => {
  const { selectedHighlightId } = useContext(DiptychContext);

  const {
    data: { highlights },
  } = useQuery(HighlightsListQuery, {
    variables: { highlightIds },
  });

  const groupedByDay = useMemo(
    () =>
      highlightIds.reduce((acc, highlightId) => {
        const highlight = highlights.find(
          (highlight) => highlight.id === highlightId
        );
        if (!highlight) return acc;

        const day = IpsumDay.fromString(highlight.entry.date, "iso");

        const dayUrlFormat = day.toString("url-format");

        if (!acc[dayUrlFormat]) acc[dayUrlFormat] = [];
        acc[dayUrlFormat].push({
          highlightId,
          entryKey: highlight.entry.entryKey,
        });
        return acc;
      }, {} as Record<string, { highlightId: string; entryKey: string }[]>),
    [highlightIds, highlights]
  );

  const days = useMemo(
    () =>
      Object.entries(groupedByDay).map(([dayUrlFormat, highlights]) => {
        const day = IpsumDay.fromString(dayUrlFormat, "url-format");
        return { day, highlights };
      }),
    [groupedByDay]
  );

  const { setSelectedHighlightId } = useContext(HighlightSelectionContext);

  return (
    <div className={styles["highlights-list"]}>
      {days.map(({ day, highlights }) => (
        <div key={day.toString("url-format")}>
          <Typography variant="h4">
            <a href="">{day.toString("entry-printed-date-nice")}</a>
          </Typography>
          <div>
            {highlights.map((highlight) => (
              <HighlightBox
                key={highlight.highlightId}
                highlightId={highlight.highlightId}
                selected={highlight.highlightId === selectedHighlightId}
                showDate={false}
                onSelect={() => {
                  setSelectedHighlightId(highlight.highlightId);
                }}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
