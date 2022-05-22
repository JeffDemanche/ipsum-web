import { DateTime } from "luxon";
import { getDaysBetween } from "util/dates";

describe("dates", () => {
  describe("getDaysBetween", () => {
    it("gets days over a week", () => {
      const out = getDaysBetween(
        DateTime.fromFormat("8/9/1998", "D"),
        DateTime.fromFormat("8/15/1998", "D")
      );

      expect(out).toHaveLength(7);
      expect(out[0].toFormat("D")).toBe("8/9/1998");
      expect(out[1].toFormat("D")).toBe("8/10/1998");
      expect(out[5].toFormat("D")).toBe("8/14/1998");
      expect(out[6].toFormat("D")).toBe("8/15/1998");
    });

    it("gets days over a month", () => {
      const out = getDaysBetween(
        DateTime.fromFormat("8/9/1998", "D"),
        DateTime.fromFormat("9/9/1998", "D")
      );

      expect(out).toHaveLength(32);
      expect(out[0].toFormat("D")).toBe("8/9/1998");
      expect(out[22].toFormat("D")).toBe("8/31/1998");
      expect(out[23].toFormat("D")).toBe("9/1/1998");
      expect(out[31].toFormat("D")).toBe("9/9/1998");
    });

    it("gets 28 days in february", () => {
      const dayInFeb = DateTime.fromObject({
        month: 2,
        year: 2022,
      });
      const monthStart = dayInFeb.startOf("month");
      const monthEnd = dayInFeb.endOf("month");

      const out = getDaysBetween(monthStart, monthEnd);

      expect(out).toHaveLength(28);
    });

    it("gets days over a week", () => {
      const out = getDaysBetween(
        DateTime.fromFormat("8/9/1998", "D"),
        DateTime.fromFormat("8/9/1999", "D")
      );

      expect(out).toHaveLength(366);
    });
  });
});
