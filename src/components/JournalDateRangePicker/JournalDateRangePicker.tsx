import React, { useCallback, useEffect, useMemo, useRef } from "react";
import styles from "./JournalDateRangePicker.less";
import { gql } from "util/apollo";
import { useQuery } from "@apollo/client";
import { IpsumDateTime } from "util/dates";
import { dataToSearchParams, urlToData } from "util/url";
import { useNavigate, useLocation } from "react-router";
import { DateRangeCalendar } from "@mui/x-date-pickers-pro/DateRangeCalendar";
import {
  DateRange,
  DateRangePickerDay,
  DateRangePickerDayProps,
  LocalizationProvider,
} from "@mui/x-date-pickers-pro";
import { AdapterDayjs } from "@mui/x-date-pickers-pro/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import { styled } from "@mui/material";

export const JournalDateRangeRecentEntriesQuery = gql(`
  query JournalDateRangeRecentEntries($count: Int!) {
    recentEntries(count: $count) {
      entryKey
      date
    }
  }
`);

const CalendarDatesContext = React.createContext<{ entryKeys: string[] }>({
  entryKeys: [],
});

export const JournalDateRangeQuery = gql(`
  query JournalDateRange($entryKeys: [ID!]!) {
    entryKeys
  }
`);

const CustomDay = styled(DateRangePickerDay)(
  ({
    theme,
    isHighlighting,
    isStartOfHighlighting,
    isEndOfHighlighting,
    outsideCurrentMonth,
    day,
  }) => {
    const { entryKeys } = React.useContext(CalendarDatesContext);

    const entryOnDate = entryKeys.includes(
      IpsumDateTime.fromJsDate((day as Dayjs).toDate()).toString(
        "entry-printed-date"
      )
    );

    return {
      ...(entryOnDate && {
        borderRadius: 0,
        button: {
          color: theme.palette.primary.main,
          fontWeight: 700,
          textDecoration: "underline",
        },
      }),
      ...(isStartOfHighlighting && {
        borderTopLeftRadius: "50%",
        borderBottomLeftRadius: "50%",
      }),
      ...(isEndOfHighlighting && {
        borderTopRightRadius: "50%",
        borderBottomRightRadius: "50%",
      }),
    };
  }
) as React.ComponentType<DateRangePickerDayProps<Dayjs>>;

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

  const dateRange: DateRange<Dayjs> = useMemo(() => {
    if (searchParams.layers?.[0]?.type === "daily_journal") {
      const startDate = searchParams.layers[0].startDate;
      const endDate = searchParams.layers[0].endDate;

      if (startDate && endDate) {
        return [dayjs(startDate), dayjs(endDate)];
      }
    }
    return [
      dayjs(recentEntriesRange[0].startDate),
      dayjs(recentEntriesRange[0].endDate),
    ];
  }, [recentEntriesRange, searchParams.layers]);

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

  const onRangeChange = useCallback(
    (dateRange: DateRange<Dayjs>) => {
      const startDate = dateRange[0]?.toDate();
      const endDate = dateRange[1]?.toDate();

      if (startDate && endDate) navigateToDates(startDate, endDate);
    },
    [navigateToDates]
  );

  return (
    <div>
      <CalendarDatesContext.Provider value={{ entryKeys: data.entryKeys }}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DateRangeCalendar
            disableFuture
            calendars={2}
            value={dateRange}
            onChange={onRangeChange}
            slots={{ day: CustomDay }}
            classes={{
              root: styles["mui-calendar-root"],
              monthContainer: styles["mui-calendar-month-container"],
            }}
          ></DateRangeCalendar>
        </LocalizationProvider>
      </CalendarDatesContext.Provider>
    </div>
  );
};
