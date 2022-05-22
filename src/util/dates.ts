/**
 * Util file for date/time-related hooks and helpers.
 */

import { DateTime } from "luxon";
import { useEffect, useState } from "react";

type DateFormatString = "month-day-year-slashes" | "month-word";

/**
 * Gets current Luxon DateTime object.
 */
export const getCurrentLocalDateTime = (): DateTime => {
  return DateTime.now();
};

/**
 * Given a Luxon DateTime object, returns a string corresponding to the given
 * format.
 */
export const formatDate = (
  date: DateTime,
  format: DateFormatString
): string => {
  switch (format) {
    case "month-day-year-slashes":
      return date.toLocaleString();
    case "month-word":
      return date.toLocaleString({ month: "long" });
    default:
      return undefined;
  }
};

export const useDate = (refreshRate: number): DateTime => {
  const [date, setDate] = useState(getCurrentLocalDateTime());

  useEffect(() => {
    const interval = setInterval(() => {
      const currentDate = getCurrentLocalDateTime();
      if (currentDate.toISO() !== date.toISO()) {
        setDate(getCurrentLocalDateTime());
      }
    }, refreshRate);

    return () => clearInterval(interval);
  }, [date, refreshRate]);

  return date;
};

export const useDateString = (
  refreshRate: number,
  format: DateFormatString
): string => {
  const [dateString, setDateString] = useState(
    formatDate(getCurrentLocalDateTime(), format)
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setDateString(formatDate(getCurrentLocalDateTime(), format));
    }, refreshRate);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return dateString;
};

export const getDaysBetween = (
  startDay: DateTime,
  endDay: DateTime
): DateTime[] => {
  const daysBetween: DateTime[] = [];
  let cursor = startDay.startOf("day");
  while (cursor <= endDay) {
    daysBetween.push(cursor);
    cursor = cursor.plus({ days: 1 });
  }
  return daysBetween;
};
