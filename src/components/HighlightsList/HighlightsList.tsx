import { useQuery } from "@apollo/client";
import { Typography } from "@mui/material";
import { DiptychContext } from "components/DiptychContext";
import { HighlightBox } from "components/HighlightBox";
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
        console.log(highlight.entry.date);

        const day = IpsumDay.fromString(highlight.entry.date, "iso");

        const dayUrlFormat = day.toString("url-format");

        if (!acc[dayUrlFormat]) acc[dayUrlFormat] = [];
        acc[dayUrlFormat].push(highlightId);
        return acc;
      }, {} as Record<string, string[]>),
    [highlightIds, highlights]
  );

  const days = useMemo(
    () =>
      Object.entries(groupedByDay).map(([dayUrlFormat, highlightIds]) => {
        const day = IpsumDay.fromString(dayUrlFormat, "url-format");
        return { day, highlightIds };
      }),
    [groupedByDay]
  );

  return (
    <div className={styles["highlights-list"]}>
      {days.map(({ day, highlightIds }) => (
        <div key={day.toString("url-format")}>
          <Typography variant="h4">
            <a href="">{day.toString("entry-printed-date-nice")}</a>
          </Typography>
          <div>
            {highlightIds.map((highlightId) => (
              <HighlightBox
                key={highlightId}
                highlightId={highlightId}
                selected={highlightId === selectedHighlightId}
                showDate={false}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
