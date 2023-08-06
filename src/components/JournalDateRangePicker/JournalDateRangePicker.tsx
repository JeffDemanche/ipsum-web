import React, { useCallback, useEffect, useMemo, useRef } from "react";
import styles from "./JournalDateRangePicker.less";
import InfiniteCalendar, {
  Calendar,
  EVENT_TYPE,
  withRange,
} from "react-infinite-calendar";
import "react-infinite-calendar/styles.css";
import { gql } from "util/apollo";
import { useQuery } from "@apollo/client";
import { IpsumDateTime } from "util/dates";
import { theme } from "styles/styles";
import { dataToSearchParams, urlToData } from "util/url";
import { useNavigate, useLocation } from "react-router";

export const JournalDateRangeRecentEntriesQuery = gql(`
  query JournalDateRangeRecentEntries($count: Int!) {
    recentEntries(count: $count) {
      entryKey
      date
    }
  }
`);

export const JournalDateRangeQuery = gql(`
  query JournalDateRange($entryKeys: [ID!]!) {
    entryDates
  }
`);

export const JournalDateRangePicker: React.FunctionComponent = () => {
  const { data: recentEntriesData } = useQuery(
    JournalDateRangeRecentEntriesQuery,
    {
      variables: { count: 10 },
    }
  );

  const hasRecentEntries = recentEntriesData.recentEntries.length > 0;

  const recentEntriesRange = useMemo(() => {
    return [
      {
        startDate: hasRecentEntries
          ? new Date(recentEntriesData.recentEntries.at(0)?.date)
          : new Date(),
        endDate: hasRecentEntries
          ? new Date(recentEntriesData.recentEntries.at(-1)?.date)
          : new Date(),
        key: "selection",
      },
    ];
  }, [hasRecentEntries, recentEntriesData.recentEntries]);

  const location = useLocation();

  const searchParams = useMemo(
    () => urlToData<"journal">(window.location.href),
    [location]
  );

  const dateRange = useMemo(() => {
    if (searchParams.layers?.[0]?.type === "daily_journal") {
      const startDate = searchParams.layers[0].startDate;
      const endDate = searchParams.layers[0].endDate;

      if (startDate && endDate) {
        return [
          {
            startDate: new Date(startDate),
            endDate: new Date(endDate),
            key: "selection",
          },
        ];
      }
    }
    return [
      {
        startDate: recentEntriesRange[0].startDate,
        endDate: recentEntriesRange[0].endDate,
        key: "selection",
      },
    ];
  }, [recentEntriesRange, searchParams.layers]);

  console.log(dateRange);

  const navigate = useNavigate();

  const navigateToDates = useCallback(
    (startDate: Date, endDate: Date) => {
      if (dateRange.length > 0) {
        const searchParams = urlToData<"journal">(window.location.href);

        if (searchParams.layers[0]?.type === "daily_journal") {
          searchParams.layers[0].startDate =
            IpsumDateTime.fromJsDate(startDate).toString("url-format");
          searchParams.layers[0].endDate =
            IpsumDateTime.fromJsDate(endDate).toString("url-format");
        }

        navigate(
          { search: dataToSearchParams(searchParams) },
          { replace: true }
        );
      }
    },
    [dateRange.length, navigate]
  );

  const { data } = useQuery(JournalDateRangeQuery);

  const sortedEntryDates = useMemo(
    () =>
      [...data.entryDates].sort(
        (a, b) => new Date(a).getTime() - new Date(b).getTime()
      ),
    [data.entryDates]
  );

  const calendarWrapperRef = useRef<HTMLDivElement>(null);

  function getDateString(year: number, month: number, date: number) {
    return `${year}-${("0" + (month + 1)).slice(-2)}-${("0" + date).slice(-2)}`;
  }

  // react-infinite-calendar doesn't have a prop for custom date rendering. This
  // is an extremely hacky workaround being used to specially render dates with
  // entries.
  const drawCustomDates = useCallback(
    (range: typeof dateRange) => {
      sortedEntryDates
        .map((date) => new Date(date))
        .forEach((date) => {
          const isSelected = range.some((r) => {
            return (
              r.startDate.getTime() <= date.getTime() &&
              r.endDate.getTime() >= date.getTime()
            );
          });

          const dayElement = calendarWrapperRef.current.querySelector(
            `[data-date="${getDateString(
              date.getFullYear(),
              date.getMonth(),
              date.getDate()
            )}"]`
          );

          let fill = theme.palette.text.primary;
          if (isSelected) fill = theme.palette.onPrimaryHighEmphasis;
          if (range[0].endDate.getTime() === date.getTime())
            fill = theme.palette.primary.main;

          let circleY = 75;
          if (
            range[0].startDate.getTime() === date.getTime() ||
            range[0].endDate.getTime() === date.getTime()
          )
            circleY = 85;

          const dayElementContent = document.createElement("div");
          dayElementContent.classList.add(styles["dot-container"]);
          dayElementContent.innerHTML = `
          <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="${circleY}" r="3" fill="${fill}" />
          </svg>
        `;

          if (dayElement) {
            if (!dayElement.classList.contains(styles["date-with-entry"])) {
              dayElement.appendChild(dayElementContent);
              dayElement.classList.add(styles["date-with-entry"]);
            }
          }
        });
    },
    [sortedEntryDates]
  );

  const onSelect = useCallback(
    ({
      eventType,
      start,
      end,
    }: {
      eventType: EVENT_TYPE;
      start: Date;
      end: Date;
    }) => {
      if (eventType === EVENT_TYPE.END) navigateToDates(start, end);

      drawCustomDates([
        {
          startDate: start,
          endDate: end,
          key: "selection",
        },
      ]);
    },
    [navigateToDates, drawCustomDates]
  );

  useEffect(() => {
    drawCustomDates(dateRange);
  }, [sortedEntryDates, dateRange]);

  return (
    <div ref={calendarWrapperRef}>
      <InfiniteCalendar
        theme={{
          headerColor: theme.palette.primary.main,
          accentColor: theme.palette.primary.main,
          floatingNav: {
            background: theme.palette.primary.main,
            chevron: theme.palette.onPrimaryHighEmphasis,
            color: theme.palette.onPrimaryHighEmphasis,
          },
          selectionColor: theme.palette.primary.main,
          weekdayColor: theme.palette.primary.dark,
          textColor: {
            default: theme.palette.onSurfaceMediumEmphasis,
            active: theme.palette.onPrimaryHighEmphasis,
          },
        }}
        Component={withRange(Calendar)}
        onSelect={onSelect}
        selected={{ start: dateRange[0].startDate, end: dateRange[0].endDate }}
        onScroll={() => drawCustomDates(dateRange)}
      ></InfiniteCalendar>
    </div>
  );
};
