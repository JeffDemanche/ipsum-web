/**
 * Util file for date/time-related hooks and helpers.
 */

import { DateTime } from "luxon";
import { useEffect, useState } from "react";

/** Date formats we can create a string of from a DateTime. */
type IpsumDateFormatTo =
  | "entry-printed-date"
  | "entry-printed-date-nice"
  | "month-word"
  | "url-format";

/** Date formats we can create a DateTime of from a string. */
type IpsumDateFormatFrom =
  | "entry-printed-date"
  | "entry-printed-date-nice"
  | "url-format";

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

export const sortDates = (
  dates: IpsumDateTime[],
  ascending = false
): IpsumDateTime[] => {
  return dates.sort((a, b) => {
    if (ascending) return a.dateTime.valueOf() > b.dateTime.valueOf() ? 1 : -1;
    else return a.dateTime.valueOf() < b.dateTime.valueOf() ? 1 : -1;
  });
};

export const stringifyIpsumDateTime = (dt: IpsumDateTime) =>
  dt.dateTime.toISO();

export const parseIpsumDateTime = (dt: string) =>
  new IpsumDateTime(DateTime.fromISO(dt));

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
      case "entry-printed-date-nice":
        return new this(DateTime.fromFormat(dateString, "D"));
      case "url-format":
        return new this(DateTime.fromFormat(dateString, "MM-dd-yyyy"));
      default:
        return undefined;
    }
  };

  isInRange = (before: IpsumDateTime, after: IpsumDateTime): boolean => {
    if (!before && !after) return false;

    return (
      before.dateTime.diff(this.dateTime, "hours").hours <= 0 &&
      after.dateTime.diff(this.dateTime, "hours").hours >= 0
    );
  };

  toString = (format: IpsumDateFormatTo): string => {
    switch (format) {
      case "entry-printed-date":
        return this._luxonDateTime.toLocaleString();
      case "entry-printed-date-nice":
        return this._luxonDateTime.toLocaleString({
          weekday: "long",
          month: "long",
          day: "2-digit",
        });
      case "month-word":
        return this._luxonDateTime.toLocaleString({ month: "long" });
      case "url-format":
        return this._luxonDateTime.toFormat("MM-dd-yyyy");
      default:
        return undefined;
    }
  };

  get dateTime() {
    return this._luxonDateTime;
  }
}
