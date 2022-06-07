import React from "react";
import { IpsumDateTime } from "util/dates";
import styles from "./CalendarDayTile.less";

interface CalendarDayTileProps {
  date: IpsumDateTime;
  entryDate?: IpsumDateTime;
}

export const CalendarDayTile: React.FC<CalendarDayTileProps> = ({
  date,
  entryDate,
}: CalendarDayTileProps) => {
  const dayNumber = date.dateTime.day;

  return entryDate ? (
    <a>{dayNumber}</a>
  ) : (
    <div className={styles["tile"]}>{dayNumber}</div>
  );
};
