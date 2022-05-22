import { DateTime } from "luxon";
import React from "react";
import styles from "./CalendarDayTile.less";

interface CalendarDayTileProps {
  date: DateTime;
}

export const CalendarDayTile: React.FC<CalendarDayTileProps> = ({
  date,
}: CalendarDayTileProps) => {
  const dayNumber = date.day;

  return <div className={styles["tile"]}>{dayNumber}</div>;
};
