import { useQuery } from "@apollo/client";
import { Typography } from "@mui/material";
import { DiptychContext } from "components/DiptychContext";
import { HighlightBox } from "components/HighlightBox";
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
} from "react";
import { gql, HighlightSortType } from "util/apollo";
import { IpsumDay } from "util/dates";
import styles from "./HighlightsList.less";
import { GroupedVirtuoso, GroupedVirtuosoHandle } from "react-virtuoso";

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
      currentImportance
      outgoingRelations {
        __typename
        predicate
        object {
          ... on Arc {
            id
            color
          }
        }
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
      highlights: typeof highlights;
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
          highlights: [highlight],
        });
      } else {
        grouped[grouped.length - 1].highlights.push(highlight);
      }
    }
    return grouped;
  }, [highlights]);

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

  const virtuosoRef = useRef<GroupedVirtuosoHandle>(null);

  useEffect(() => {
    if (selectedHighlightId && virtuosoRef.current) {
      const index = highlights.findIndex(
        (highlight) => highlight.id === selectedHighlightId
      );
      virtuosoRef.current.scrollToIndex(index);
    }
  }, [highlights, selectedHighlightId]);

  return (
    <GroupedVirtuoso
      ref={virtuosoRef}
      className={styles["highlights-list"]}
      groupCounts={groupedByDay.map((group) => group.highlights.length)}
      groupContent={(index) => {
        const day = groupedByDay[index].day;

        return (
          <Typography variant="h4">
            <a onClick={(e) => onDateClick(e, day)}>
              {day.toString("entry-printed-date-nice-with-year")}{" "}
              <span className={styles["relative-date-text"]}>
                {day.toString("relative-calendar")}
              </span>
            </a>
          </Typography>
        );
      }}
      itemContent={(index) => {
        const highlight = highlights[index];
        return (
          <HighlightBox
            className={styles["list-highlight-box"]}
            key={highlight.id}
            highlight={highlight}
            selected={highlight.id === selectedHighlightId}
            showDate={false}
            onSelect={() => {
              setSelectedHighlightId(highlight.id);
            }}
          />
        );
      }}
    />
  );
};
