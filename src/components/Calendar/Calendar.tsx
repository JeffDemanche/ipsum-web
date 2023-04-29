import { useQuery } from "@apollo/client";
import { Button, Link, Paper, Typography } from "@mui/material";
import { Info, DateTime } from "luxon";
import React, { useCallback, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { gql } from "util/apollo";
import {
  getDaysBetween,
  IpsumDateTime,
  parseIpsumDateTime,
  useDate,
} from "util/dates";
import styles from "./Calendar.less";
import { CalendarDayTile } from "./CalendarDayTile";

export const CalendarQuery = gql(`
  query Calendar {
    entries {
      entryKey
      date
    }
  }
`);

export const Calendar: React.FC = () => {
  const date = useDate(3000);

  const { data } = useQuery(CalendarQuery, {
    fetchPolicy: "cache-only",
  });

  const entries = data.entries;

  const allEntryDates = useMemo(
    () => Object.values(entries).map((entry) => parseIpsumDateTime(entry.date)),
    [entries]
  );

  const [monthYear, setMonthYear] = useState(
    () =>
      new IpsumDateTime(
        DateTime.fromObject({
          month: date.dateTime.month,
          year: date.dateTime.year,
        })
      )
  );

  const monthJournalEntries = useMemo(() => {
    const c =
      allEntryDates &&
      allEntryDates.filter((date) => {
        return date.dateTime?.month === monthYear.dateTime?.month;
      });
    return c;
  }, [allEntryDates, monthYear.dateTime.month]);

  const startOfMonth = new IpsumDateTime(monthYear.dateTime.startOf("month"));
  const endOfMonth = new IpsumDateTime(monthYear.dateTime.endOf("month"));

  const monthString = useMemo(
    () => monthYear.toString("month-word"),
    [monthYear]
  );

  // This would be different if we started the week on a different day.
  const emptyDaysAtStartOfMonth = startOfMonth.dateTime.weekday % 7;

  // By default this starts with Monday, we want it to start with Sunday.
  const weekdays = Info.weekdays("short");
  weekdays.unshift(weekdays.pop());

  const daysOfWeek = weekdays.map((dayString, i) => (
    <Typography
      variant="caption"
      data-testid={`calendar-day-of-week-${dayString}`}
      className={styles["day-of-week"]}
      key={i}
    >
      {dayString.toLocaleLowerCase()}
    </Typography>
  ));

  const emptyDays = [...Array(emptyDaysAtStartOfMonth)].map((_, i) => (
    <div data-testid="calendar-empty-day" key={i}></div>
  ));

  const actualDays = getDaysBetween(startOfMonth, endOfMonth).map((day, i) => {
    return (
      <CalendarDayTile
        date={day}
        entryDate={
          monthJournalEntries &&
          monthJournalEntries.find(
            (entry) => entry.dateTime.toISO() === day.dateTime.toISO()
          )
        }
        key={i}
      />
    );
  });

  const nextMonth = () => {
    setMonthYear(new IpsumDateTime(monthYear.dateTime.plus({ months: 1 })));
  };

  const previousMonth = () => {
    setMonthYear(new IpsumDateTime(monthYear.dateTime.minus({ months: 1 })));
  };

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const resetDates = useCallback(() => {
    const newParams = new URLSearchParams(searchParams);
    newParams.delete("startDate");
    newParams.delete("endDate");
    newParams.delete("date");
    navigate({ search: newParams.toString() }, { replace: false });
    setMonthYear(
      new IpsumDateTime(
        DateTime.fromObject({
          month: date.dateTime.month,
          year: date.dateTime.year,
        })
      )
    );
  }, [date.dateTime.month, date.dateTime.year, navigate, searchParams]);

  return (
    <Paper className={styles["calendar"]}>
      <Typography variant="overline">{monthYear.dateTime.year}</Typography>
      <Typography variant="h6" className={styles["month-title-with-arrows"]}>
        <Link
          tabIndex={0}
          className={styles["arrow"]}
          aria-label="Previous month"
          onClick={previousMonth}
          onKeyDown={(e) => {
            if (e.key === "Enter") previousMonth();
          }}
        >
          «
        </Link>{" "}
        <span className={styles["month-name"]}>{monthString}</span>{" "}
        <Link
          tabIndex={0}
          className={styles["arrow"]}
          aria-label="Next month"
          onClick={nextMonth}
          onKeyDown={(e) => {
            if (e.key === "Enter") nextMonth();
          }}
        >
          »
        </Link>
      </Typography>
      <div className={styles["calendar-grid"]}>
        {daysOfWeek}
        {emptyDays}
        {actualDays}
      </div>
      <div className={styles["reset-button-container"]}>
        <Button href="#" onClick={resetDates} variant="outlined">
          Today
        </Button>
      </div>
    </Paper>
  );
};
