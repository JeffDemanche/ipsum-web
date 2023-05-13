import React, { useCallback, useEffect, useMemo, useState } from "react";
import { DateRange, Range } from "react-date-range";
import styles from "./JournalDateRangePicker.less";
import "react-date-range/dist/styles.css"; // main css file
import "react-date-range/dist/theme/default.css"; // theme css file
import { gql } from "util/apollo";
import { useQuery } from "@apollo/client";
import { IpsumDateTime } from "util/dates";
import { theme } from "styles/styles";
import { dataToSearchParams, urlToData } from "util/url";
import { useNavigate } from "react-router";

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
    entries(entryKeys: $entryKeys) {
      entryKey
    }
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
          ? new Date(recentEntriesData.recentEntries.at(-1)?.date)
          : new Date(),
        endDate: hasRecentEntries
          ? new Date(recentEntriesData.recentEntries.at(0)?.date)
          : new Date(),
        key: "selection",
      },
    ];
  }, [hasRecentEntries, recentEntriesData.recentEntries]);

  const [dateRange, setDateRange] = useState<Range[]>(recentEntriesRange);

  useEffect(() => {
    setDateRange(recentEntriesRange);
  }, [recentEntriesRange]);

  const navigate = useNavigate();

  useEffect(() => {
    if (dateRange.length > 0) {
      const searchParams = urlToData<"journal">(window.location.href);

      if (searchParams.layers[0]?.type === "daily_journal") {
        searchParams.layers[0].startDate = IpsumDateTime.fromJsDate(
          dateRange[0].startDate
        ).toString("url-format");
        searchParams.layers[0].endDate = IpsumDateTime.fromJsDate(
          dateRange[0].endDate
        ).toString("url-format");
      }

      navigate({ search: dataToSearchParams(searchParams) }, { replace: true });
    }
  }, [dateRange, navigate]);

  const today = new Date();

  const dateToMonthEntryKeys = useCallback((item: Date) => {
    const monthStartDay =
      IpsumDateTime.fromJsDate(item).dateTime.startOf("month");
    const monthEndDay = IpsumDateTime.fromJsDate(item).dateTime.endOf("month");

    const monthEntryKeys: string[] = [];
    let dayCounter = monthStartDay.day;
    while (dayCounter <= monthEndDay.day) {
      const day = IpsumDateTime.fromJsDate(
        monthStartDay.set({ day: dayCounter }).toJSDate()
      );
      monthEntryKeys.push(day.toString("entry-printed-date"));
      dayCounter++;
    }
    return monthEntryKeys;
  }, []);

  const [monthEntryKeys, setMonthEntryKeys] = useState<string[]>(
    dateToMonthEntryKeys(
      IpsumDateTime.fromJsDate(today).dateTime.startOf("month").toJSDate()
    )
  );

  const { data } = useQuery(JournalDateRangeQuery, {
    variables: { entryKeys: monthEntryKeys },
  });

  const dayContentRenderer = useCallback(
    (day: Date) => {
      if (
        !monthEntryKeys.includes(
          IpsumDateTime.fromJsDate(day).toString("entry-printed-date")
        )
      ) {
        // Days outside of current month
        return (
          <div style={{ color: theme.palette.onSurfaceDisabled }}>
            {day.getDate()}
          </div>
        );
      } else if (
        data.entries
          .map((entry) => entry.entryKey)
          .includes(
            IpsumDateTime.fromJsDate(day).toString("entry-printed-date")
          )
      ) {
        // Days with entries
        return (
          <div className={styles["date-with-entry"]}>
            {day.getDate()}
            <div className={styles["dot-container"]}>.</div>
          </div>
        );
      } else {
        // Days without entries
        return (
          <div style={{ color: theme.palette.onSurfaceMediumEmphasis }}>
            {day.getDate()}
          </div>
        );
      }
    },
    [data.entries, monthEntryKeys]
  );

  return (
    <DateRange
      date={today}
      className={styles["picker"]}
      onChange={(item) => {
        setDateRange([item.selection]);
      }}
      onShownDateChange={(item) => {
        setMonthEntryKeys(dateToMonthEntryKeys(item));
      }}
      moveRangeOnFirstSelection={false}
      dayContentRenderer={dayContentRenderer}
      ranges={dateRange}
      direction="vertical"
      preventSnapRefocus={true}
      calendarFocus="backwards"
      color="black"
      rangeColors={[theme.palette.background.default]}
      shownDate={today}
    ></DateRange>
  );
};
