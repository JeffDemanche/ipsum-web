import { vars, initializeState } from "util/apollo/client";
import { EntryType } from "util/apollo/__generated__/graphql";
import { IpsumDateTime, IpsumDay } from "util/dates";
import { IpsumTimeMachine } from "util/diff";
import { createEntry, deleteEntry, updateEntry } from "../entries";

jest.mock("../../autosave");

describe("apollo entries API", () => {
  let todaySpy = jest.spyOn(IpsumDay, "today");

  beforeEach(() => {
    initializeState();
    todaySpy = jest.spyOn(IpsumDay, "today");
  });

  afterEach(() => {
    todaySpy.mockRestore();
    jest.clearAllMocks();
  });

  describe("createEntry", () => {
    it("should add entries to the state", () => {
      const entry1 = {
        entryKey: "1/2/2020",
        htmlString: "<p>Hello, world 1!</p>",
        entryType: EntryType.Journal,
      };
      const entry2 = {
        entryKey: "4/2/2020",
        htmlString: "<p>Hello, world 2!</p>",
        entryType: EntryType.Journal,
      };
      jest.useFakeTimers().setSystemTime(new Date(2020, 0, 2));
      createEntry(entry1);
      expect(vars.entries()["1/2/2020"]).toEqual(
        expect.objectContaining({
          entryKey: "1/2/2020",
          history: {
            __typename: "History",
            dateCreated: IpsumDateTime.fromString(
              "1/2/2020",
              "entry-printed-date"
            ).toString("iso"),
          },
        })
      );
      jest.useFakeTimers().setSystemTime(new Date(2020, 3, 2));
      createEntry(entry2);
      expect(vars.entries()["4/2/2020"]).toEqual(
        expect.objectContaining({
          entryKey: "4/2/2020",
          history: {
            __typename: "History",
            dateCreated: IpsumDateTime.fromString(
              "4/2/2020",
              "entry-printed-date"
            ).toString("iso"),
          },
        })
      );
    });

    it("should set initial htmlString", () => {
      createEntry({
        entryKey: "1/2/2020",
        htmlString: "<p>Hello, world!</p>",
        entryType: EntryType.Journal,
      });
      expect(vars.entries()["1/2/2020"]).toEqual(
        expect.objectContaining({
          entryKey: "1/2/2020",
          trackedHTMLString: IpsumTimeMachine.create(
            "<p>Hello, world!</p>"
          ).toString(),
        })
      );
    });

    it("should create a day object if it doesn't exist", () => {
      todaySpy.mockReturnValueOnce(IpsumDay.fromString("1/2/2020"));
      jest.useFakeTimers().setSystemTime(new Date(2020, 0, 2));
      createEntry({
        entryKey: "1/2/2020",
        htmlString: "<p>Hello, world!</p>",
        entryType: EntryType.Journal,
      });
      expect(vars.days()).toEqual(
        expect.objectContaining({
          "1/2/2020": expect.objectContaining({
            day: "1/2/2020",
          }),
        })
      );
    });
  });

  describe("updateEntry", () => {
    it("should update entries in the state", () => {
      const entry1 = {
        entryKey: "1/2/2020",
        htmlString: "<p>Hello, world!</p>",
        entryType: EntryType.Journal,
      };
      const entry2 = {
        entryKey: "4/2/2020",
        htmlString: "<p>Hello, world!</p>",
        entryType: EntryType.Journal,
      };
      createEntry(entry1);
      createEntry(entry2);
      expect(vars.entries()).toEqual({
        "1/2/2020": expect.objectContaining({
          entryKey: "1/2/2020",
          trackedHTMLString: IpsumTimeMachine.create(
            "<p>Hello, world!</p>"
          ).toString(),
        }),
        "4/2/2020": expect.objectContaining({
          entryKey: "4/2/2020",
          trackedHTMLString: IpsumTimeMachine.create(
            "<p>Hello, world!</p>"
          ).toString(),
        }),
      });

      updateEntry({
        entryKey: "1/2/2020",
        htmlString: "<p>Hello, world 1!</p>",
      });
      expect(vars.entries()).toEqual({
        "1/2/2020": expect.objectContaining({
          entryKey: "1/2/2020",
          trackedHTMLString: IpsumTimeMachine.create(
            "<p>Hello, world 1!</p>"
          ).toString(),
        }),
        "4/2/2020": expect.objectContaining({
          entryKey: "4/2/2020",
          trackedHTMLString: IpsumTimeMachine.create(
            "<p>Hello, world!</p>"
          ).toString(),
        }),
      });
    });

    it("should appropriately update trackedHTMLString", () => {
      jest
        .spyOn(IpsumDateTime, "today")
        .mockReturnValue(IpsumDateTime.fromJsDate(new Date("2020-01-01")));

      createEntry({
        entryKey: "1/1/2020",
        htmlString: "<p>Hello, world on january first!</p>",
        entryType: EntryType.Journal,
      });

      jest
        .spyOn(IpsumDateTime, "today")
        .mockReturnValue(IpsumDateTime.fromJsDate(new Date("2020-02-01")));

      updateEntry({
        entryKey: "1/1/2020",
        htmlString: "<p>Hello, world on february first!</p>",
      });

      const timeMachine = IpsumTimeMachine.fromString(
        vars.entries()["1/1/2020"].trackedHTMLString
      );
      expect(timeMachine.currentValue).toEqual(
        "<p>Hello, world on february first!</p>"
      );
      expect(timeMachine.valueAtDate(new Date("2020-01-23"))).toEqual(
        "<p>Hello, world on january first!</p>"
      );
    });
  });

  describe("deleteEntry", () => {
    it("should delete entries from the state", () => {
      const entry1 = {
        entryKey: "1/2/2020",
        htmlString: "<p>Hello, world on january first!</p>",
        entryType: EntryType.Journal,
      };

      const entry2 = {
        entryKey: "4/2/2020",
        htmlString: "<p>Hello, world on january first!</p>",
        entryType: EntryType.Journal,
      };
      createEntry(entry1);
      createEntry(entry2);
      expect(Object.keys(vars.entries())).toEqual(["1/2/2020", "4/2/2020"]);
      deleteEntry("1/2/2020");
      expect(Object.keys(vars.entries())).toEqual(["4/2/2020"]);
    });
  });
});
