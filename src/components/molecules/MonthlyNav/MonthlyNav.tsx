import { ArrowBack, ArrowForward, Today } from "@mui/icons-material";
import cx from "classnames";
import { Button } from "components/atoms/Button";
import React, { useMemo, useState } from "react";
import { IpsumDay } from "util/dates";
import { TestIds } from "util/test-ids";

import styles from "./MonthlyNav.less";

interface MonthlyNavProps {
  className?: string;

  entryDays: IpsumDay[];
  selectedDay: IpsumDay;
  today: IpsumDay;
  defaultMonth?: IpsumDay;

  onDaySelect?: (day: IpsumDay) => void;
  onMonthChange?: (month: IpsumDay) => void;
}

export const MonthlyNav: React.FunctionComponent<MonthlyNavProps> = ({
  className,
  entryDays,
  selectedDay,
  today,
  defaultMonth,
  onDaySelect,
  onMonthChange,
}) => {
  const [month, setMonth] = useState<IpsumDay>(
    defaultMonth?.firstDayOfMonth() ??
      selectedDay?.firstDayOfMonth() ??
      today.firstDayOfMonth()
  );

  const monthsWithEntries = useMemo(() => {
    const months = [today.firstDayOfMonth().toString("url-format")];
    entryDays.forEach((day, i) => {
      if (!months.includes(day.firstDayOfMonth().toString("url-format"))) {
        months.push(day.firstDayOfMonth().toString("url-format"));
      }
    }, []);
    return months.map((month) => IpsumDay.fromString(month, "url-format"));
  }, [entryDays, today]);

  const nextMonth = monthsWithEntries
    .filter((monthWithEntries) => monthWithEntries.isAfter(month))
    .reduce((prev, cur) => (cur?.isBefore(prev) ? cur : prev), undefined);
  const prevMonth = monthsWithEntries
    .filter((monthWithEntries) => monthWithEntries.isBefore(month))
    .reduce((prev, cur) => (cur?.isAfter(prev) ? cur : prev), undefined);

  const nextMonthExists = !!nextMonth;

  const prevMonthExists = !!prevMonth;

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
    () => entryDays.filter((date) => date.isSameMonthAs(month)),
    [entryDays, month]
  );

  const entryButtons = entriesThisMonth.map((day) => (
    <Button
      key={day.toString("day")}
      data-testid={TestIds.DailyJournal.MonthlyNavEntryButton(
        day.toString("day")
      )}
      className={cx(
        styles["day-button"],
        day.equals(selectedDay) && styles["selected"]
      )}
      variant="text"
      onClick={() => {
        onDaySelect?.(day);
      }}
    >
      {day.toString("day")}
    </Button>
  ));

  return (
    <div
      data-testid={TestIds.DailyJournal.MonthlyNav}
      className={cx(styles["monthly-nav"], className)}
    >
      <Button
        onClick={goToPrevMonth}
        disabled={!prevMonthExists}
        startIcon={<ArrowBack />}
      >
        <div className={styles["nav-button-text"]}>
          <span className={styles["nav-button-top-span"]}>
            {prevMonth?.toString("month-word") ?? ""}
          </span>
          <span className={styles["nav-button-bottom-span"]}>
            {prevMonth?.toString("year") ?? ""}
          </span>
        </div>
      </Button>
      <div className={styles["middle-section"]}>
        <Button variant="link" className={styles["month-button"]}>
          <div className={cx(styles["nav-button-text"])}>
            <span className={styles["nav-button-top-span"]}>
              {month?.toString("month-word") ?? ""}
            </span>
            <span className={styles["nav-button-bottom-span"]}>
              {month?.toString("year") ?? ""}
            </span>
          </div>
        </Button>
        {entryButtons}
        <Button
          variant="text"
          startIcon={<Today />}
          className={cx(
            styles["day-button"],
            today.equals(selectedDay) && styles["selected"]
          )}
          onClick={() => {
            onDaySelect?.(today);
          }}
        >
          Today
        </Button>
      </div>
      <Button
        onClick={goToNextMonth}
        disabled={!nextMonthExists}
        endIcon={<ArrowForward />}
      >
        <div className={styles["nav-button-text"]}>
          <span className={styles["nav-button-top-span"]}>
            {nextMonth?.toString("month-word") ?? ""}
          </span>
          <span className={styles["nav-button-bottom-span"]}>
            {nextMonth?.toString("year") ?? ""}
          </span>
        </div>
      </Button>
    </div>
  );
};
