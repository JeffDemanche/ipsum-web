import { DateTime } from "luxon";
import React from "react";
import styles from "./CalendarDayTile.less";

interface CalendarDayTileProps {
  date: DateTime;
  entryDate?: DateTime;
}

export const CalendarDayTile: React.FC<CalendarDayTileProps> = ({
  date,
  entryDate,
}: CalendarDayTileProps) => {
  const dayNumber = date.day;

  return entryDate ? (
    <a>{dayNumber}</a>
  ) : (
    <div className={styles["tile"]}>{dayNumber}</div>
  );
};
