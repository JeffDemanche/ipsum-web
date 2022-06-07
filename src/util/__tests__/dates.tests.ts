import { DateTime } from "luxon";
import { getDaysBetween, IpsumDateTime } from "util/dates";

describe("dates", () => {
  describe("date formatting", () => {
    it("formats date in entry title format", () => {
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

    it("formats month as a word (as for calendar headings)", () => {
      const ipsumDate = IpsumDateTime.fromString(
        "2/2/1345",
        "entry-printed-date"
      );
      expect(ipsumDate.toString("month-word")).toBe("February");
    });
  });

  describe("getDaysBetween", () => {
    it("gets days over a week", () => {
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

    it("gets days over a month", () => {
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

    it("gets 28 days in february", () => {
      const dayInFeb = DateTime.fromObject({
        month: 2,
        year: 2022,
      });
      const monthStart = new IpsumDateTime(dayInFeb.startOf("month"));
      const monthEnd = new IpsumDateTime(dayInFeb.endOf("month"));

      const out = getDaysBetween(monthStart, monthEnd);

      expect(out).toHaveLength(28);
    });

    it("gets days over a week", () => {
      const out = getDaysBetween(
        IpsumDateTime.fromString("8/9/1998", "entry-printed-date"),
        IpsumDateTime.fromString("8/9/1999", "entry-printed-date")
      );

      expect(out).toHaveLength(366);
    });
  });
});
