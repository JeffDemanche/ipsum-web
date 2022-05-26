import { Info, DateTime } from "luxon";
import React, { useContext, useMemo, useState } from "react";
import { JournalStateContext } from "state/JournalStateContext";
import { formatDate, getDaysBetween, useDate } from "util/dates";
import styles from "./Calendar.less";
import { CalendarDayTile } from "./CalendarDayTile";

export const Calendar: React.FC = () => {
  const date = useDate(3000);

  const { allEntryDates } = useContext(JournalStateContext);

  const [monthYear, setMonthYear] = useState(() =>
    DateTime.fromObject({
      month: date.month,
      year: date.year,
    })
  );

  const monthJournalEntries = useMemo(() => {
    const c =
      allEntryDates &&
      allEntryDates.filter((entry) => entry.month === monthYear.month);
    return c;
  }, [allEntryDates, monthYear.month]);

  const startOfMonth = monthYear.startOf("month");
  const endOfMonth = monthYear.endOf("month");

  const dateString = useMemo(() => formatDate(date, "month-word"), [date]);

  // This would be different if we started the week on a different day.
  const emptyDaysAtStartOfMonth = startOfMonth.weekday % 7;

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
          monthJournalEntries.find((entry) => entry.toISO() === day.toISO())
        }
        key={i}
      />
    );
  });

  return (
    <div className={styles["calendar"]}>
      <div className={styles["month-title"]}>{dateString}</div>
      <div className={styles["calendar-grid"]}>
        {daysOfWeek}
        {emptyDays}
        {actualDays}
      </div>
    </div>
  );
};
