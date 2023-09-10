import { IpsumDateTime } from "../dates";
import { IpsumDay } from "../day";

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
});
