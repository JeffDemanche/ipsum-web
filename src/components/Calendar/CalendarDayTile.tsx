import React from "react";
import { Link } from "react-router-dom";
import { IpsumDateTime } from "util/dates";
import { entryUrl } from "util/urls";
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
    <Link to={entryUrl(entryDate)}>{dayNumber}</Link>
  ) : (
    <div className={styles["tile"]}>{dayNumber}</div>
  );
};
