import { useQuery } from "@apollo/client";
import { Typography } from "@mui/material";
import { DiptychContext } from "components/DiptychContext";
import { HighlightBox } from "components/HighlightBox";
import React, { useCallback, useContext, useMemo } from "react";
import { gql, HighlightSortType } from "util/apollo";
import { IpsumDay } from "util/dates";
import styles from "./HighlightsList.less";

interface HighlightsListProps {
  highlightIds: string[];
}

const HighlightsListQuery = gql(`
  query HighlightsList($highlightIds: [ID!]!, $sort: HighlightSortType) {
    highlights(ids: $highlightIds, sort: $sort) {
      id
      history {
        dateCreated
      }
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
  const { selectedHighlightId, setSelectedHighlightId, sort } =
    useContext(DiptychContext);

  const sortVariable = useMemo(() => {
    if (sort === "importance") return HighlightSortType.ImportanceDesc;
    if (sort === "date") return HighlightSortType.DateDesc;
    return undefined;
  }, [sort]);

  const {
    data: { highlights },
  } = useQuery(HighlightsListQuery, {
    variables: { highlightIds: highlightIds ?? [], sort: sortVariable },
  });

  const groupedByDay = useMemo(() => {
    const grouped: {
      day: IpsumDay;
      highlights: { highlightId: string; entryKey: string }[];
    }[] = [];
    for (const highlight of highlights) {
      if (!highlight) continue;

      const day = IpsumDay.fromString(highlight.entry.date, "iso");

      const dayUrlFormat = day.toString("url-format");

      if (
        grouped.length === 0 ||
        grouped[grouped.length - 1].day.toString("url-format") !== dayUrlFormat
      ) {
        grouped.push({
          day,
          highlights: [
            { entryKey: highlight.entry.entryKey, highlightId: highlight.id },
          ],
        });
      } else {
        grouped[grouped.length - 1].highlights.push({
          entryKey: highlight.entry.entryKey,
          highlightId: highlight.id,
        });
      }
    }
    return grouped;
  }, [highlights]);

  // const groupedByDay = useMemo(
  //   () =>
  //     highlights.reduce((acc, highlight) => {
  //       if (!highlight) return acc;

  //       const day = IpsumDay.fromString(highlight.entry.date, "iso");

  //       const dayUrlFormat = day.toString("url-format");

  //       if (!acc[dayUrlFormat]) acc[dayUrlFormat] = [];
  //       acc[dayUrlFormat].push({
  //         highlightId: highlight.id,
  //         entryKey: highlight.entry.entryKey,
  //       });
  //       return acc;
  //     }, {} as Record<string, { highlightId: string; entryKey: string }[]>),
  //   [highlights]
  // );

  // console.log(groupedByDay);

  // const days = useMemo(
  //   () =>
  //     Object.entries(groupedByDay).map(([dayUrlFormat, highlights]) => {
  //       const day = IpsumDay.fromString(dayUrlFormat, "url-format");
  //       return { day, highlights };
  //     }),
  //   [groupedByDay]
  // );

  const { pushLayer } = useContext(DiptychContext);

  const onDateClick = useCallback(
    (e: React.MouseEvent, day: IpsumDay) => {
      e.stopPropagation();
      pushLayer({
        type: "daily_journal",
        mode: "past",
        visibleDates: [day.toString("url-format")],
      });
    },
    [pushLayer]
  );

  return (
    <div className={styles["highlights-list"]}>
      {groupedByDay.length === 0 && (
        <Typography variant="h4">No highlight results</Typography>
      )}
      {groupedByDay.map(({ day, highlights }, i) => (
        <div key={i}>
          <Typography variant="h4">
            <a onClick={(e) => onDateClick(e, day)} href="#">
              {day.toString("entry-printed-date-nice-with-year")}{" "}
              <span className={styles["relative-date-text"]}>
                {day.toString("relative-calendar")}
              </span>
            </a>
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
