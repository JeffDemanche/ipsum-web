import React, { useCallback, useEffect, useMemo, useState } from "react";
import { DateRange, DateRangePicker } from "react-date-range";
import styles from "./JournalDateRangePicker.less";
import "react-date-range/dist/styles.css"; // main css file
import "react-date-range/dist/theme/default.css"; // theme css file
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
          ? new Date(recentEntriesData.recentEntries.at(-1)?.date)
          : new Date(),
        endDate: hasRecentEntries
          ? new Date(recentEntriesData.recentEntries.at(0)?.date)
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

  const navigate = useNavigate();

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

  const today = new Date();

  const [monthEntryKeys, setMonthEntryKeys] = useState<string[]>(() =>
    dateToMonthEntryKeys(
      IpsumDateTime.fromJsDate(today).dateTime.startOf("month").toJSDate()
    )
  );

  const { data } = useQuery(JournalDateRangeQuery);

  const sortedEntryDates = useMemo(
    () =>
      [...data.entryDates].sort(
        (a, b) => new Date(a).getTime() - new Date(b).getTime()
      ),
    [data.entryDates]
  );

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
        sortedEntryDates
          .map((date) =>
            IpsumDateTime.fromJsDate(new Date(date)).toString(
              "entry-printed-date"
            )
          )
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
          <div style={{ color: theme.palette.onSurfaceHighEmphasis }}>
            {day.getDate()}
          </div>
        );
      }
    },
    [monthEntryKeys, sortedEntryDates]
  );

  return (
    <DateRange
      date={today}
      className={styles["picker"]}
      onChange={(item) => {
        navigateToDates(item.selection.startDate, item.selection.endDate);
      }}
      onShownDateChange={(item) => {
        setMonthEntryKeys(dateToMonthEntryKeys(item));
      }}
      retainEndDateOnFirstSelection={true}
      moveRangeOnFirstSelection={false}
      dayContentRenderer={dayContentRenderer}
      ranges={dateRange}
      direction="vertical"
      preventSnapRefocus={true}
      calendarFocus="backwards"
      color="black"
      rangeColors={[theme.palette.background.default]}
      shownDate={today}
      minDate={
        sortedEntryDates.length ? new Date(sortedEntryDates.at(0)) : undefined
      }
      maxDate={
        sortedEntryDates.length ? new Date(sortedEntryDates.at(-1)) : undefined
      }
    ></DateRange>
  );
};
