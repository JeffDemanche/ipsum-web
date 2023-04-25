import { vars, initializeState } from "util/apollo/client";
import { parseContentState, stringifyContentState } from "util/content-state";
import { createEditorStateFromFormat } from "util/__tests__/editor-utils";
import {
  assignHighlightToEntry,
  createEntry,
  deleteEntry,
  removeHighlightFromEntry,
  updateEntry,
} from "../entries";
import { createHighlight } from "../highlights";

describe("apollo entries API", () => {
  beforeEach(() => {
    initializeState();
  });

  describe("createEntry", () => {
    it("should add entries to the state", () => {
      const entry1 = {
        entryKey: "1/2/2020",
        date: "1/2/2020",
        contentState: "Hello, world!",
      };
      const entry2 = {
        entryKey: "4/2/2020",
        date: "4/2/2020",
        contentState: "Hello, world 2!",
      };
      createEntry(entry1);
      expect(vars.entries()).toEqual({ "1/2/2020": entry1 });
      createEntry(entry2);
      expect(vars.entries()).toEqual({
        "1/2/2020": entry1,
        "4/2/2020": entry2,
      });
    });
  });

  describe("updateEntry", () => {
    it("should update entries in the state", () => {
      const entry1 = {
        entryKey: "1/2/2020",
        date: "1/2/2020",
        contentState: "Hello, world!",
      };
      const entry2 = {
        entryKey: "4/2/2020",
        date: "4/2/2020",
        contentState: "Hello, world 2!",
      };
      createEntry(entry1);
      createEntry(entry2);
      expect(vars.entries()).toEqual({
        "1/2/2020": entry1,
        "4/2/2020": entry2,
      });
      updateEntry({ entryKey: "1/2/2020", contentState: "Hello, world 3!" });
      expect(vars.entries()).toEqual({
        "1/2/2020": { ...entry1, contentState: "Hello, world 3!" },
        "4/2/2020": entry2,
      });
    });
  });

  describe("assign and remove highlights", () => {
    it("should create and remove draftjs entity for range", () => {
      const editorState = createEditorStateFromFormat("<p>[Hello] world</p>");
      const entry1 = {
        entryKey: "1/2/2020",
        date: "1/2/2020",
        contentState: stringifyContentState(editorState.getCurrentContent()),
      };
      createEntry(entry1);
      const highlight = createHighlight({ arc: "1", entry: "1/2/2020" });
      assignHighlightToEntry({
        entryKey: "1/2/2020",
        highlightId: highlight.id,
        selectionState: editorState.getSelection(),
      });
      const cs = parseContentState(vars.entries()["1/2/2020"].contentState);
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
      const entry1 = {
        entryKey: "1/2/2020",
        date: "1/2/2020",
        contentState: "Hello, world!",
      };
      const entry2 = {
        entryKey: "4/2/2020",
        date: "4/2/2020",
        contentState: "Hello, world 2!",
      };
      createEntry(entry1);
      createEntry(entry2);
      expect(vars.entries()).toEqual({
        "1/2/2020": entry1,
        "4/2/2020": entry2,
      });
      deleteEntry("1/2/2020");
      expect(vars.entries()).toEqual({ "4/2/2020": entry2 });
    });
  });
});
