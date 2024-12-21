import { IpsumDay } from "util/dates";

import { highlightImportanceOnDay } from "..";

describe("highlightImportanceOnDay", () => {
  test("should return 0 if no ratings", () => {
    expect(highlightImportanceOnDay({ ratings: [] })).toEqual(0);
  });

  test.each([
    [7, [{ day: "1/1/2024", value: 1 }], "12/31/2023", 0],
    [7, [{ day: "1/1/2024", value: 1 }], "1/1/2024", 1],
    [7, [{ day: "1/1/2024", value: 1 }], "1/8/2024", 0.5],
    [7, [{ day: "1/1/2024", value: 1 }], "1/15/2024", 0.25],
    [
      7,
      [
        { day: "1/1/2024", value: 1 },
        { day: "1/15/2024", value: 1 },
      ],
      "1/15/2024",
      1.25,
    ],
  ])(
    "half life: %i, ratings: %o, day: %s results in: %f",
    (halfLife, ratings, days, expected) => {
      expect(
        highlightImportanceOnDay({
          ratings,
          day: IpsumDay.fromString(days, "stored-day"),
          halfLife,
        })
      ).toEqual(expected);
    }
  );
});
