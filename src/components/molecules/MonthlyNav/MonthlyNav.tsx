import { ArrowBack, ArrowForward, Today } from "@mui/icons-material";
import cx from "classnames";
import { Button } from "components/atoms/Button";
import React, { useMemo, useState } from "react";
import { IpsumDay } from "util/dates";

import styles from "./MonthlyNav.less";

interface MonthlyNavProps {
  className?: string;

  entryDates: IpsumDay[];
  selectedDay: IpsumDay;
  today: IpsumDay;
  defaultMonth?: IpsumDay;

  onDaySelect?: (day: IpsumDay) => void;
  onMonthChange?: (month: IpsumDay) => void;
}

export const MonthlyNav: React.FunctionComponent<MonthlyNavProps> = ({
  className,
  entryDates,
  selectedDay,
  today,
  defaultMonth,
  onDaySelect,
  onMonthChange,
}) => {
  const earliestEntry = useMemo(
    () =>
      entryDates.reduce(
        (prev, curr) => (prev.isBefore(curr) ? prev : curr),
        entryDates[0]
      ),
    [entryDates]
  );

  const latestEntry = useMemo(
    () =>
      entryDates.reduce(
        (prev, curr) => (prev.isAfter(curr) ? prev : curr),
        entryDates[0]
      ),
    [entryDates]
  );

  const [month, setMonth] = useState<IpsumDay>(
    defaultMonth?.firstDayOfMonth() ??
      selectedDay?.firstDayOfMonth() ??
      today.firstDayOfMonth()
  );

  const nextMonth = month.add(0, 1);
  const prevMonth = month.add(0, -1);

  const nextMonthExists =
    nextMonth.isBefore(today.lastDayOfMonth()) &&
    latestEntry &&
    (nextMonth.isBefore(latestEntry) || nextMonth.equals(latestEntry));
  const prevMonthExists =
    earliestEntry &&
    (prevMonth.isAfter(earliestEntry.firstDayOfMonth()) ||
      prevMonth.equals(earliestEntry.firstDayOfMonth()));

  const goToNextMonth = () => {
    if (nextMonthExists) {
      setMonth(nextMonth);
      onMonthChange?.(nextMonth);
    }
  };

  const goToPrevMonth = () => {
    if (prevMonthExists) {
      setMonth(prevMonth);
      onMonthChange?.(prevMonth);
    }
  };

  const entriesThisMonth = useMemo(
    () => entryDates.filter((date) => date.isSameMonthAs(month)),
    [entryDates, month]
  );

  const entryButtons = entriesThisMonth.map((day) => (
    <Button
      key={day.toString("day")}
      className={cx(
        styles["day-button"],
        day.equals(selectedDay) && styles["selected"]
      )}
      variant="link"
      onClick={() => {
        onDaySelect?.(day);
      }}
    >
      {day.toString("day")}
    </Button>
  ));

  return (
    <div className={cx(styles["monthly-nav"], className)}>
      <Button
        onClick={goToPrevMonth}
        disabled={!prevMonthExists}
        startIcon={<ArrowBack />}
      >
        <div className={styles["nav-button-text"]}>
          <span className={styles["nav-button-top-span"]}>
            {prevMonth.toString("month-word")}
          </span>
          <span className={styles["nav-button-bottom-span"]}>
            {prevMonth.toString("year")}
          </span>
        </div>
      </Button>
      <div>
        <Button variant="link" startIcon={<Today />}>
          Today
        </Button>
        <Button variant="link">{month.toString("month-word")}</Button>
        {entryButtons}
      </div>
      <Button
        onClick={goToNextMonth}
        disabled={!nextMonthExists}
        endIcon={<ArrowForward />}
      >
        <div className={styles["nav-button-text"]}>
          <span className={styles["nav-button-top-span"]}>
            {nextMonth.toString("month-word")}
          </span>
          <span className={styles["nav-button-bottom-span"]}>
            {nextMonth.toString("year")}
          </span>
        </div>
      </Button>
    </div>
  );
};
