import { DateTime } from "luxon";
import { getDaysBetween, IpsumDateTime, sortDates } from "util/dates";

describe("dates", () => {
  describe("date formatting", () => {
    test("formats date in entry title format", () => {
      const ipsumDate = IpsumDateTime.fromString(
        "8/9/1998",
        "entry-printed-date"
      );
      expect(ipsumDate.dateTime.month).toBe(8);
      expect(ipsumDate.dateTime.day).toBe(9);
      expect(ipsumDate.dateTime.year).toBe(1998);
      expect(ipsumDate.dateTime.minute).toBe(0);
      expect(ipsumDate.dateTime.hour).toBe(0);
      expect(ipsumDate.toString("entry-printed-date")).toBe("8/9/1998");
    });

    test("formats month as a word (as for calendar headings)", () => {
      const ipsumDate = IpsumDateTime.fromString(
        "2/2/1345",
        "entry-printed-date"
      );
      expect(ipsumDate.toString("month-word")).toBe("February");
    });
  });

  describe("sort dates", () => {
    test("sorts dates in ascending order", () => {
      const ipsumDates = [
        new IpsumDateTime(DateTime.fromISO("2000-03-03")),
        new IpsumDateTime(DateTime.fromISO("2000-01-01")),
        new IpsumDateTime(DateTime.fromISO("2000-04-04")),
        new IpsumDateTime(DateTime.fromISO("2000-02-02")),
      ];

      expect(
        sortDates(ipsumDates, true).map((d) => d.toString("entry-printed-date"))
      ).toEqual(["1/1/2000", "2/2/2000", "3/3/2000", "4/4/2000"]);
    });

    test("sorts dates in descending order", () => {
      const ipsumDates = [
        new IpsumDateTime(DateTime.fromISO("2000-03-03")),
        new IpsumDateTime(DateTime.fromISO("2000-01-01")),
        new IpsumDateTime(DateTime.fromISO("2000-04-04")),
        new IpsumDateTime(DateTime.fromISO("2000-02-02")),
      ];

      expect(
        sortDates(ipsumDates).map((d) => d.toString("entry-printed-date"))
      ).toEqual(["4/4/2000", "3/3/2000", "2/2/2000", "1/1/2000"]);
    });
  });

  describe("get days between", () => {
    test("gets days over a week", () => {
      const out = getDaysBetween(
        IpsumDateTime.fromString("8/9/1998", "entry-printed-date"),
        IpsumDateTime.fromString("8/15/1998", "entry-printed-date")
      );

      expect(out).toHaveLength(7);
      expect(out[0].toString("entry-printed-date")).toBe("8/9/1998");
      expect(out[1].toString("entry-printed-date")).toBe("8/10/1998");
      expect(out[5].toString("entry-printed-date")).toBe("8/14/1998");
      expect(out[6].toString("entry-printed-date")).toBe("8/15/1998");
    });

    test("gets days over a month", () => {
      const out = getDaysBetween(
        IpsumDateTime.fromString("8/9/1998", "entry-printed-date"),
        IpsumDateTime.fromString("9/9/1998", "entry-printed-date")
      );

      expect(out).toHaveLength(32);
      expect(out[0].toString("entry-printed-date")).toBe("8/9/1998");
      expect(out[22].toString("entry-printed-date")).toBe("8/31/1998");
      expect(out[23].toString("entry-printed-date")).toBe("9/1/1998");
      expect(out[31].toString("entry-printed-date")).toBe("9/9/1998");
    });

    test("gets 28 days in february", () => {
      const dayInFeb = DateTime.fromObject({
        month: 2,
        year: 2022,
      });
      const monthStart = new IpsumDateTime(dayInFeb.startOf("month"));
      const monthEnd = new IpsumDateTime(dayInFeb.endOf("month"));

      const out = getDaysBetween(monthStart, monthEnd);

      expect(out).toHaveLength(28);
    });

    test("gets days over a week", () => {
      const out = getDaysBetween(
        IpsumDateTime.fromString("8/9/1998", "entry-printed-date"),
        IpsumDateTime.fromString("8/9/1999", "entry-printed-date")
      );

      expect(out).toHaveLength(366);
    });
  });

  describe("isInRange", () => {
    test("specify date within range", () => {
      expect(
        IpsumDateTime.fromString("10/28/2022", "entry-printed-date").isInRange(
          IpsumDateTime.fromString("10/27/2022", "entry-printed-date"),
          IpsumDateTime.fromString("10/29/2022", "entry-printed-date")
        )
      ).toBeTruthy();
      expect(
        IpsumDateTime.fromString("10/26/2022", "entry-printed-date").isInRange(
          IpsumDateTime.fromString("10/27/2022", "entry-printed-date"),
          IpsumDateTime.fromString("10/29/2022", "entry-printed-date")
        )
      ).toBeFalsy();
      expect(
        IpsumDateTime.fromString("10/30/2022", "entry-printed-date").isInRange(
          IpsumDateTime.fromString("10/27/2022", "entry-printed-date"),
          IpsumDateTime.fromString("10/29/2022", "entry-printed-date")
        )
      ).toBeFalsy();
      expect(
        IpsumDateTime.fromString("10-03-2022", "url-format").isInRange(
          IpsumDateTime.fromString("10-01-2022", "url-format"),
          IpsumDateTime.fromString("10-31-2022", "url-format")
        )
      ).toBeTruthy();
    });

    test("inclusive to before and after params", () => {
      expect(
        IpsumDateTime.fromString("10/27/2022", "entry-printed-date").isInRange(
          IpsumDateTime.fromString("10/27/2022", "entry-printed-date"),
          IpsumDateTime.fromString("10/27/2022", "entry-printed-date")
        )
      ).toBeTruthy();
    });
  });
});
