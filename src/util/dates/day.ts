import { DateTime } from "luxon";
import { useEffect, useState } from "react";

import {
  getCurrentLocalDateTime,
  IpsumDateFormatFrom,
  IpsumDateFormatTo,
  IpsumDateTime,
} from "./dates";

export const useToday = (refreshRate: number): IpsumDay => {
  const [day, setDay] = useState(
    IpsumDay.fromLuxonDateTime(getCurrentLocalDateTime())
  );

  useEffect(() => {
    const interval = setInterval(() => {
      if (!IpsumDay.today().equals(day)) {
        setDay(IpsumDay.today());
      }
    }, refreshRate);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return day;
};

/**
 * Represents a day in the Gregorian calendar with Ipsum-specific functionality.
 */
export class IpsumDay {
  private _day: number;
  private _month: number;
  private _year: number;

  constructor(day: number, month: number, year: number) {
    this._day = day;
    this._month = month;
    this._year = year;
  }

  add(days: number, months?: number): IpsumDay {
    return IpsumDay.fromLuxonDateTime(
      this.toLuxonDateTime().plus({ days, months })
    );
  }

  toString(format?: IpsumDateFormatTo): string {
    return this.toIpsumDateTime().toString(format ?? "stored-day");
  }

  toIpsumDateTime(): IpsumDateTime {
    return IpsumDateTime.fromJsDate(this.toJsDate());
  }

  toJsDate(): Date {
    return new Date(this._year, this._month, this._day);
  }

  toLuxonDateTime(): DateTime {
    return DateTime.fromJSDate(this.toJsDate());
  }

  firstDayOfMonth(): IpsumDay {
    const jsDate = DateTime.fromJSDate(
      new Date(this._year, this._month, this._day)
    )
      .startOf("month")
      .toJSDate();
    return new IpsumDay(
      jsDate.getDate(),
      jsDate.getMonth(),
      jsDate.getFullYear()
    );
  }

  lastDayOfMonth(): IpsumDay {
    const jsDate = DateTime.fromJSDate(
      new Date(this._year, this._month, this._day)
    )
      .endOf("month")
      .toJSDate();
    return new IpsumDay(
      jsDate.getDate(),
      jsDate.getMonth(),
      jsDate.getFullYear()
    );
  }

  isSameMonthAs(day: IpsumDay): boolean {
    return this._month === day._month && this._year === day._year;
  }

  isToday(): boolean {
    return this.equals(IpsumDay.today());
  }

  /**
   * Inclusive.
   */
  isBetween(start: IpsumDay, end: IpsumDay): boolean {
    return (
      DateTime.fromJSDate(this.toJsDate()).startOf("day").toMillis() >=
        DateTime.fromJSDate(start.toJsDate()).toMillis() &&
      DateTime.fromJSDate(this.toJsDate()).startOf("day").toMillis() <=
        DateTime.fromJSDate(end.toJsDate()).toMillis()
    );
  }

  numDaysUntil(day: IpsumDay): number {
    return day
      .toLuxonDateTime()
      .startOf("day")
      .diff(this.toLuxonDateTime(), "days").days;
  }

  isInFuture(): boolean {
    return this.isAfter(IpsumDay.today());
  }

  equals(day: IpsumDay): boolean {
    return (
      this._day === day._day &&
      this._month === day._month &&
      this._year === day._year
    );
  }

  isBefore(day: IpsumDay): boolean {
    return (
      this.toLuxonDateTime().startOf("day").toMillis() <
      day.toLuxonDateTime().startOf("day").toMillis()
    );
  }

  isAfter(day: IpsumDay): boolean {
    return (
      this.toLuxonDateTime().startOf("day").toMillis() >
      day.toLuxonDateTime().startOf("day").toMillis()
    );
  }

  static fromJsDate(jsDate: Date): IpsumDay {
    return new IpsumDay(
      jsDate.getDate(),
      jsDate.getMonth(),
      jsDate.getFullYear()
    );
  }

  static fromLuxonDateTime(luxonDateTime: DateTime): IpsumDay {
    const jsDate = luxonDateTime.toJSDate();
    return IpsumDay.fromJsDate(jsDate);
  }

  static fromIpsumDateTime(ipsumDateTime: IpsumDateTime): IpsumDay {
    const jsDate = ipsumDateTime.dateTime.toJSDate();
    return IpsumDay.fromJsDate(jsDate);
  }

  static fromString(
    dateString: string,
    format?: IpsumDateFormatFrom
  ): IpsumDay {
    if (!dateString) return undefined;

    return IpsumDay.fromIpsumDateTime(
      IpsumDateTime.fromString(dateString, format ?? "stored-day")
    );
  }

  static today(): IpsumDay {
    return IpsumDay.fromIpsumDateTime(IpsumDateTime.today());
  }
}
