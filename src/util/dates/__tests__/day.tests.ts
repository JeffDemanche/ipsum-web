import { IpsumDateTime } from "../ipsum-date-time";
import { IpsumDay } from "../ipsum-day";

describe("day", () => {
  it("should convert from IpsumDateTime", () => {
    const day = IpsumDay.fromIpsumDateTime(
      IpsumDateTime.fromString("1/1/2021", "stored-day")
    );
    expect(day.toString()).toEqual("1/1/2021");
  });

  it("should convert from string", () => {
    const day = IpsumDay.fromString("1/1/2021");
    expect(day.toString()).toEqual("1/1/2021");
    expect(day.toJsDate().getDate()).toEqual(1);
    expect(day.toJsDate().getMonth()).toEqual(0);
    expect(day.toJsDate().getFullYear()).toEqual(2021);
  });

  describe("add", () => {
    it("adding one month to last day of month", () => {
      const day = IpsumDay.fromString("1/31/2021");
      const nextMonth = day.add(0, 1);
      expect(nextMonth.toString()).toEqual("2/28/2021");
    });
  });

  describe("start and end days", () => {
    it("should get start of month", () => {
      const day = IpsumDay.fromString("1/1/2021");
      const start = day.firstDayOfMonth();
      expect(start.toString()).toEqual("1/1/2021");
    });

    it("should get end of month", () => {
      const day = IpsumDay.fromString("1/1/2021");
      const end = day.lastDayOfMonth();
      expect(end.toString()).toEqual("1/31/2021");
    });
  });

  describe("isBetween", () => {
    it("last day of month should be between first and last", () => {
      const day = IpsumDay.fromString("1/31/2021");
      const start = IpsumDay.fromString("1/1/2021");
      const end = IpsumDay.fromString("1/31/2021");
      expect(day.isBetween(start, end)).toBeTruthy();
    });
  });

  describe("numDaysUntil", () => {
    it("should be 0 days until same day", () => {
      const day = IpsumDay.fromString("1/1/2021");
      expect(day.numDaysUntil(day)).toEqual(0);
    });

    it("should be 1 day until next day", () => {
      const day = IpsumDay.fromString("1/1/2021");
      const nextDay = IpsumDay.fromString("1/2/2021");
      expect(day.numDaysUntil(nextDay)).toEqual(1);
    });

    it("should be -1 day until previous day", () => {
      const day = IpsumDay.fromString("1/2/2021");
      const previousDay = IpsumDay.fromString("1/1/2021");
      expect(day.numDaysUntil(previousDay)).toEqual(-1);
    });
  });
});
