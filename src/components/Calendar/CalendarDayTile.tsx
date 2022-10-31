import React from "react";
import { Link, useSearchParams } from "react-router-dom";
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
  const [searchParams] = useSearchParams();

  const dayNumber = date.dateTime.day;

  const linkSearchParams = new URLSearchParams(searchParams);
  if (entryDate) {
    linkSearchParams.set("startDate", entryDate.toString("url-format"));
    linkSearchParams.set("endDate", entryDate.toString("url-format"));
  }

  return entryDate ? (
    <Link
      to={{
        search: linkSearchParams.toString(),
      }}
    >
      {dayNumber}
    </Link>
  ) : (
    <div className={styles["tile"]}>{dayNumber}</div>
  );
};
