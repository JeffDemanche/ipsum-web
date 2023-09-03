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

  add(days: number): IpsumDay {
    const jsDate = new Date(this._year, this._month, this._day);
    jsDate.setDate(jsDate.getDate() + days);
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