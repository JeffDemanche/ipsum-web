import { ContentState } from "draft-js";
import { vars, initializeState } from "util/apollo/client";
import { EntryType } from "util/apollo/__generated__/graphql";
import { parseContentState, stringifyContentState } from "util/content-state";
import { IpsumDateTime, IpsumDay } from "util/dates";
import { IpsumTimeMachine } from "util/diff";
import { createEditorStateFromFormat } from "util/__tests__/editor-utils";
import {
  assignHighlightToEntry,
  createEntry,
  deleteEntry,
  removeHighlightFromEntry,
  updateEntry,
} from "../entries";
import { createHighlight } from "../highlights";

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
      const entry1CS = stringifyContentState(
        ContentState.createFromText("Hello, world!")
      );
      const entry1 = {
        entryKey: "1/2/2020",
        stringifiedContentState: entry1CS,
        htmlString: "<p>Hello, world 1!</p>",
        entryType: EntryType.Journal,
      };
      const entry2CS = stringifyContentState(
        ContentState.createFromText("Hello, world 2!")
      );
      const entry2 = {
        entryKey: "4/2/2020",
        stringifiedContentState: entry2CS,
        htmlString: "<p>Hello, world 2!</p>",
        entryType: EntryType.Journal,
      };
      jest.useFakeTimers().setSystemTime(new Date(2020, 0, 2));
      createEntry(entry1);
      expect(vars.entries()["1/2/2020"]).toEqual(
        expect.objectContaining({
          entryKey: "1/2/2020",
          trackedContentState: IpsumTimeMachine.create(entry1CS).toString(),
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
          trackedContentState: IpsumTimeMachine.create(entry2CS).toString(),
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

    it("should set initial trackedContentState", () => {
      const entry1CS = stringifyContentState(
        ContentState.createFromText("Hello, world!")
      );
      createEntry({
        entryKey: "1/2/2020",
        htmlString: "<p>Hello, world!</p>",
        stringifiedContentState: entry1CS,
        entryType: EntryType.Journal,
      });
      expect(vars.entries()["1/2/2020"]).toEqual(
        expect.objectContaining({
          entryKey: "1/2/2020",
          trackedContentState: IpsumTimeMachine.create(entry1CS).toString(),
        })
      );
    });

    it("should create a day object if it doesn't exist", () => {
      todaySpy.mockReturnValueOnce(IpsumDay.fromString("1/2/2020"));
      const entry1CS = stringifyContentState(
        ContentState.createFromText("Hello, world!")
      );
      jest.useFakeTimers().setSystemTime(new Date(2020, 0, 2));
      createEntry({
        entryKey: "1/2/2020",
        htmlString: "<p>Hello, world!</p>",
        stringifiedContentState: entry1CS,
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
      const entry1CS = stringifyContentState(
        ContentState.createFromText("Hello, world!")
      );
      const entry1 = {
        entryKey: "1/2/2020",
        htmlString: "<p>Hello, world!</p>",
        stringifiedContentState: entry1CS,
        entryType: EntryType.Journal,
      };
      const entry2CS = stringifyContentState(
        ContentState.createFromText("Hello, world 2!")
      );
      const entry2 = {
        entryKey: "4/2/2020",
        htmlString: "<p>Hello, world!</p>",
        stringifiedContentState: entry2CS,
        entryType: EntryType.Journal,
      };
      createEntry(entry1);
      createEntry(entry2);
      expect(vars.entries()).toEqual({
        "1/2/2020": expect.objectContaining({
          entryKey: "1/2/2020",
          trackedContentState: IpsumTimeMachine.create(entry1CS).toString(),
        }),
        "4/2/2020": expect.objectContaining({
          entryKey: "4/2/2020",
          trackedContentState: IpsumTimeMachine.create(entry2CS).toString(),
        }),
      });
      const entry1CS2 = stringifyContentState(
        ContentState.createFromText("Hello, world 3!")
      );
      updateEntry({
        entryKey: "1/2/2020",
        stringifiedContentState: entry1CS2,
      });
      expect(vars.entries()).toEqual({
        "1/2/2020": expect.objectContaining({
          entryKey: "1/2/2020",
          trackedContentState: IpsumTimeMachine.create(entry1CS2).toString(),
        }),
        "4/2/2020": expect.objectContaining({
          entryKey: "4/2/2020",
          trackedContentState: IpsumTimeMachine.create(entry2CS).toString(),
        }),
      });
    });

    it("should appropriately update trackedContentState", () => {
      jest
        .spyOn(IpsumDateTime, "today")
        .mockReturnValue(IpsumDateTime.fromJsDate(new Date("2020-01-01")));

      const entry1CS = stringifyContentState(
        ContentState.createFromText("Hello, world on january first!")
      );
      createEntry({
        entryKey: "1/1/2020",
        htmlString: "<p>Hello, world on january first!</p>",
        stringifiedContentState: entry1CS,
        entryType: EntryType.Journal,
      });

      jest
        .spyOn(IpsumDateTime, "today")
        .mockReturnValue(IpsumDateTime.fromJsDate(new Date("2020-02-01")));
      const entry2CS = stringifyContentState(
        ContentState.createFromText("Hello, world on february first!")
      );
      updateEntry({
        entryKey: "1/1/2020",
        stringifiedContentState: entry2CS,
      });

      const timeMachine = IpsumTimeMachine.fromString(
        vars.entries()["1/1/2020"].trackedContentState
      );
      expect(
        parseContentState(timeMachine.currentValue).getPlainText()
      ).toEqual("Hello, world on february first!");
      expect(
        parseContentState(
          timeMachine.valueAtDate(new Date("2020-01-23"))
        ).getPlainText()
      ).toEqual("Hello, world on january first!");
    });
  });

  describe("assign and remove highlights", () => {
    it("should create and remove draftjs entity for range", () => {
      const editorState = createEditorStateFromFormat("<p>[Hello] world</p>");
      const entry1 = {
        entryKey: "1/2/2020",
        htmlString: "<p>Hello, world on january first!</p>",
        stringifiedContentState: stringifyContentState(
          editorState.getCurrentContent()
        ),
        entryType: EntryType.Journal,
      };
      createEntry(entry1);
      const highlight = createHighlight({ entry: "1/2/2020" });
      assignHighlightToEntry({
        entryKey: "1/2/2020",
        highlightId: highlight.id,
        selectionState: editorState.getSelection(),
      });
      const cs = parseContentState(
        IpsumTimeMachine.fromString(
          vars.entries()["1/2/2020"].trackedContentState
        ).currentValue
      );
      expect(cs.getLastBlock().getEntityAt(0)).not.toBeNull();
      expect(cs.getLastBlock().getEntityAt(4)).not.toBeNull();
      expect(cs.getLastBlock().getEntityAt(5)).toBeNull();
      expect(
        cs.getEntity(cs.getLastBlock().getEntityAt(0)).getData()
          .textArcAssignments
      ).toEqual([{ arcAssignmentId: highlight.id }]);
      removeHighlightFromEntry({
        entryKey: "1/2/2020",
        highlightId: highlight.id,
      });
      expect(cs.getEntity(cs.getLastBlock().getEntityAt(0)).getData()).toEqual({
        textArcAssignments: [],
      });
    });
  });

  describe("deleteEntry", () => {
    it("should delete entries from the state", () => {
      const entry1CS = stringifyContentState(
        ContentState.createFromText("Hello, world!")
      );
      const entry1 = {
        entryKey: "1/2/2020",
        htmlString: "<p>Hello, world on january first!</p>",
        stringifiedContentState: entry1CS,
        entryType: EntryType.Journal,
      };
      const entry2CS = stringifyContentState(
        ContentState.createFromText("Hello, world 2!")
      );
      const entry2 = {
        entryKey: "4/2/2020",
        htmlString: "<p>Hello, world on january first!</p>",
        stringifiedContentState: entry2CS,
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
