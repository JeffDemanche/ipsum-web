import { Info, DateTime } from "luxon";
import React, { useContext, useMemo, useState } from "react";
import { InMemoryStateContext } from "state/in-memory/InMemoryStateProvider";
import { getDaysBetween, IpsumDateTime, useDate } from "util/dates";
import styles from "./Calendar.less";
import { CalendarDayTile } from "./CalendarDayTile";

export const Calendar: React.FC = () => {
  const date = useDate(3000);

  const { state } = useContext(InMemoryStateContext);

  const allEntryDates = useMemo(
    () => Object.values(state.entries).map((entry) => entry.date),
    [state]
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
    <div
      data-testid={`calendar-day-of-week-${dayString}`}
      className={styles["day-of-week"]}
      key={i}
    >
      {dayString.toLocaleLowerCase()}
    </div>
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

  return (
    <div className={styles["calendar"]}>
      <div className={styles["year-title"]}>{monthYear.dateTime.year}</div>
      <div className={styles["month-title-with-arrows"]}>
        <a
          className={styles["arrow"]}
          aria-label="Previous month"
          onClick={previousMonth}
        >
          «
        </a>{" "}
        <span className={styles["month-name"]}>{monthString}</span>{" "}
        <a
          className={styles["arrow"]}
          aria-label="Next month"
          onClick={nextMonth}
        >
          »
        </a>
      </div>
      <div className={styles["calendar-grid"]}>
        {daysOfWeek}
        {emptyDays}
        {actualDays}
      </div>
    </div>
  );
};
