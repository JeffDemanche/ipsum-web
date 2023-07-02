import { ContentState } from "draft-js";
import { vars, initializeState } from "util/apollo/client";
import { EntryType } from "util/apollo/__generated__/graphql";
import { parseContentState, stringifyContentState } from "util/content-state";
import { IpsumDateTime } from "util/dates";
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
  beforeEach(() => {
    initializeState();
  });

  describe("createEntry", () => {
    it("should add entries to the state", () => {
      const entry1CS = stringifyContentState(
        ContentState.createFromText("Hello, world!")
      );
      const entry1 = {
        entryKey: "1/2/2020",
        stringifiedContentState: entry1CS,
        entryType: EntryType.Journal,
      };
      const entry2CS = stringifyContentState(
        ContentState.createFromText("Hello, world 2!")
      );
      const entry2 = {
        entryKey: "4/2/2020",
        stringifiedContentState: entry2CS,
        entryType: EntryType.Journal,
      };
      createEntry(entry1);
      expect(vars.entries()["1/2/2020"]).toEqual(
        expect.objectContaining({
          entryKey: "1/2/2020",
          trackedContentState: IpsumTimeMachine.create(entry1CS).toString(),
          history: {
            __typename: "History",
            dateCreated: IpsumDateTime.today().toString("iso"),
          },
        })
      );
      createEntry(entry2);
      expect(vars.entries()["4/2/2020"]).toEqual(
        expect.objectContaining({
          entryKey: "4/2/2020",
          trackedContentState: IpsumTimeMachine.create(entry2CS).toString(),
          history: {
            __typename: "History",
            dateCreated: IpsumDateTime.today().toString("iso"),
          },
        })
      );
    });

    it.todo("should set initial trackedContentState");
  });

  describe("updateEntry", () => {
    it("should update entries in the state", () => {
      const entry1CS = stringifyContentState(
        ContentState.createFromText("Hello, world!")
      );
      const entry1 = {
        entryKey: "1/2/2020",
        stringifiedContentState: entry1CS,
        entryType: EntryType.Journal,
      };
      const entry2CS = stringifyContentState(
        ContentState.createFromText("Hello, world 2!")
      );
      const entry2 = {
        entryKey: "4/2/2020",
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

    it.todo("should appropriately update trackedContentState");
  });

  describe("assign and remove highlights", () => {
    it("should create and remove draftjs entity for range", () => {
      const editorState = createEditorStateFromFormat("<p>[Hello] world</p>");
      const entry1 = {
        entryKey: "1/2/2020",
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
        stringifiedContentState: entry1CS,
        entryType: EntryType.Journal,
      };
      const entry2CS = stringifyContentState(
        ContentState.createFromText("Hello, world 2!")
      );
      const entry2 = {
        entryKey: "4/2/2020",
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
