import { IpsumDateFormatFrom, IpsumDateFormatTo, IpsumDateTime } from "./dates";

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
    const jsDate = new Date(this._year, this._month, this._day);
    jsDate.setDate(jsDate.getDate() + days);
    if (months) {
      jsDate.setMonth(jsDate.getMonth() + months);
    }
    return new IpsumDay(
      jsDate.getDate(),
      jsDate.getMonth(),
      jsDate.getFullYear()
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

  firstDayOfMonth(): IpsumDay {
    return new IpsumDay(1, this._month, this._year);
  }

  lastDayOfMonth(): IpsumDay {
    return new IpsumDay(0, this._month + 1, this._year);
  }

  /**
   * Inclusive.
   */
  isBetween(start: IpsumDay, end: IpsumDay): boolean {
    return (
      this.toJsDate().getTime() >= start.toJsDate().getTime() &&
      this.toJsDate().getTime() <= end.toJsDate().getTime()
    );
  }

  equals(day: IpsumDay): boolean {
    return (
      this._day === day._day &&
      this._month === day._month &&
      this._year === day._year
    );
  }

  isBefore(day: IpsumDay): boolean {
    return this.toJsDate().getTime() < day.toJsDate().getTime();
  }

  isAfter(day: IpsumDay): boolean {
    return this.toJsDate().getTime() > day.toJsDate().getTime();
  }

  static fromIpsumDateTime(ipsumDateTime: IpsumDateTime): IpsumDay {
    const jsDate = ipsumDateTime.dateTime.toJSDate();
    return new IpsumDay(
      jsDate.getDate(),
      jsDate.getMonth(),
      jsDate.getFullYear()
    );
  }

  static fromString(
    dateString: string,
    format?: IpsumDateFormatFrom
  ): IpsumDay {
    return IpsumDay.fromIpsumDateTime(
      IpsumDateTime.fromString(dateString, format ?? "stored-day")
    );
  }

  static today(): IpsumDay {
    return IpsumDay.fromIpsumDateTime(IpsumDateTime.today());
  }
}
