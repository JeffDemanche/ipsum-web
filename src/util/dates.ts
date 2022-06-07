/**
 * Util file for date/time-related hooks and helpers.
 */

import { DateTime } from "luxon";
import { useEffect, useState } from "react";

/** Date formats we can create a string of from a DateTime. */
type IpsumDateFormatTo = "entry-printed-date" | "month-word";

/** Date formats we can create a DateTime of from a string. */
type IpsumDateFormatFrom = "entry-printed-date";

/**
 * Gets current Luxon DateTime object.
 */
export const getCurrentLocalDateTime = (): DateTime => {
  return DateTime.now();
};

export const useDate = (refreshRate: number): IpsumDateTime => {
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

  return new IpsumDateTime(date);
};

export const useDateString = (
  refreshRate: number,
  format: IpsumDateFormatTo
): string => {
  const [dateString, setDateString] = useState(
    new IpsumDateTime(getCurrentLocalDateTime())
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setDateString(new IpsumDateTime(getCurrentLocalDateTime()));
    }, refreshRate);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return dateString.toString(format);
};

export const getDaysBetween = (
  startDay: IpsumDateTime,
  endDay: IpsumDateTime
): IpsumDateTime[] => {
  const daysBetween: IpsumDateTime[] = [];
  let cursor = startDay.dateTime.startOf("day");
  while (cursor <= endDay.dateTime) {
    daysBetween.push(new IpsumDateTime(cursor));
    cursor = cursor.plus({ days: 1 });
  }
  return daysBetween;
};

export class IpsumDateTime {
  private _luxonDateTime: DateTime;

  constructor(dateTime: DateTime) {
    this._luxonDateTime = dateTime;
  }

  static fromJsDate = (jsDate: Date) => {
    return new this(DateTime.fromJSDate(jsDate));
  };

  static fromString = (dateString: string, format: IpsumDateFormatFrom) => {
    switch (format) {
      case "entry-printed-date":
        return new this(DateTime.fromFormat(dateString, "D"));
      default:
        return undefined;
    }
  };

  toString = (format: IpsumDateFormatTo): string => {
    switch (format) {
      case "entry-printed-date":
        return this._luxonDateTime.toLocaleString();
      case "month-word":
        return this._luxonDateTime.toLocaleString({ month: "long" });
      default:
        return undefined;
    }
  };

  get dateTime() {
    return this._luxonDateTime;
  }
}
