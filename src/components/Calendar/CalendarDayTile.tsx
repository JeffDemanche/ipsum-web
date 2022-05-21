import { DateTime } from "luxon";
import React from "react";
import styles from "./CalendarDayTile.less";

interface CalendarDayTileProps {
  date: DateTime;
}

export const CalendarDayTile: React.FC<CalendarDayTileProps> = ({
  date,
}: CalendarDayTileProps) => {
  return <div className={styles["tile"]}></div>;
};
