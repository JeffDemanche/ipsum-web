import { Info } from "luxon";
import React, { useMemo } from "react";
import { formatDate, useDate } from "util/dates";
import styles from "./Calendar.less";

export const Calendar: React.FC = () => {
  const date = useDate(3000);

  const dateString = useMemo(() => formatDate(date, "month-word"), [date]);

  const daysOfWeek = Info.weekdays("short").map((dayString, i) => (
    <div className={styles["day-of-week"]} key={i}>
      {dayString.toLocaleLowerCase()}
    </div>
  ));

  return (
    <div className={styles["calendar"]}>
      <div>{dateString}</div>
      <div className={styles["calendar-grid"]}>{daysOfWeek}</div>
    </div>
  );
};
