import { IpsumTimeMachine } from "../diff";

describe("diff", () => {
  test("sets and gets a single entry", () => {
    const timeMachine = new IpsumTimeMachine().setValueAtDate(
      new Date("2020-01-01"),
      "goob"
    );

    const result = timeMachine.valueAtDate(new Date("2020-01-01"));

    expect(result).toEqual("goob");
  });

  test("returns undefined when there are no patches", () => {
    const timeMachine = new IpsumTimeMachine();

    expect(timeMachine.valueAtDate(new Date("2020-01-01"))).toBeUndefined();
  });

  test("sets and gets multiple entries", () => {
    const timeMachine = new IpsumTimeMachine()
      .setValueAtDate(new Date("2020-01-01"), "goob")
      .setValueAtDate(new Date("2020-01-02"), "gob")
      .setValueAtDate(new Date("2020-01-05"), "gob blob");

    expect(timeMachine.valueAtDate(new Date("2019-12-29"))).toBeUndefined();
    expect(timeMachine.valueAtDate(new Date("2020-01-01"))).toEqual("goob");
    expect(timeMachine.valueAtDate(new Date("2020-01-02"))).toEqual("gob");
    expect(timeMachine.valueAtDate(new Date("2020-01-04"))).toEqual("gob");
    expect(timeMachine.valueAtDate(new Date("2020-01-06"))).toEqual("gob blob");
  });

  test("is able to overwrite the most recent date with only one date", () => {
    const timeMachine = new IpsumTimeMachine()
      .setValueAtDate(new Date("2020-01-01"), "goob")
      .setValueAtDate(new Date("2020-01-01"), "gob")
      .setValueAtDate(new Date("2020-01-01"), "goober");

    expect(timeMachine.valueAtDate(new Date("2020-01-01"))).toEqual("goober");
    expect(timeMachine.currentValue).toEqual("goober");
  });

  test("is able to overwrite the most recent date with multiple dates", () => {
    const timeMachine = new IpsumTimeMachine()
      .setValueAtDate(new Date("2020-01-01"), "goob")
      .setValueAtDate(new Date("2020-01-02"), "gob")
      .setValueAtDate(new Date("2020-01-02"), "goober");

    expect(timeMachine.valueAtDate(new Date("2020-01-02"))).toEqual("goober");
  });

  test("throws when setting a date before the last patch date", () => {
    const timeMachine = new IpsumTimeMachine()
      .setValueAtDate(new Date("2020-01-01"), "goob")
      .setValueAtDate(new Date("2020-01-02"), "gob");

    expect(() => {
      timeMachine.setValueAtDate(new Date("2019-01-01"), "gob");
    }).toThrowError("Cannot set value for date before last patch date");
  });

  test("works with large generated text", () => {
    const chunk1 =
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec auctor, nisl vitae aliquam lacinia, nunc nisl aliquet nunc, vitae aliquam nisl.";
    const chunk2 =
      "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga.";
    const chunk3 = "Et harum quidem rerum facilis est et expedita distinctio.";

    const timeMachine = new IpsumTimeMachine()
      .setValueAtDate(new Date("2020-05-01"), `${chunk1}${chunk2}`)
      .setValueAtDate(new Date("2020-05-05"), `${chunk1}${chunk2}${chunk3}`)
      .setValueAtDate(new Date("2020-05-10"), `${chunk2}${chunk3}`);

    expect(timeMachine.valueAtDate(new Date("2020-05-01"))).toEqual(
      `${chunk1}${chunk2}`
    );
    expect(timeMachine.valueAtDate(new Date("2020-05-02"))).toEqual(
      `${chunk1}${chunk2}`
    );
    expect(timeMachine.valueAtDate(new Date("2020-05-06"))).toEqual(
      `${chunk1}${chunk2}${chunk3}`
    );
    expect(timeMachine.valueAtDate(new Date("2020-05-11"))).toEqual(
      `${chunk2}${chunk3}`
    );
  });
});
