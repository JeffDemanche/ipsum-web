import { EntryType } from "util/apollo";
import { IpsumDay } from "util/dates";
import { IpsumTimeMachine } from "util/diff";
import { ProjectState } from "util/state";

import { createComment } from "../comment/create-comment";
import { deleteComment } from "../comment/delete-comment";
import { createEntry } from "../entry/create-entry";
import { createHighlight } from "../highlight/create-highlight";

describe("API comment actions", () => {
  describe("createComment", () => {
    test("should create a comment, highlight, relation, and entry for the day created if it doesn't exist", () => {
      const state = new ProjectState();
      const dayCreated = IpsumDay.fromString("1/7/2020", "stored-day");

      const objectHighlightEntry = createEntry(
        {
          dayCreated: IpsumDay.fromString("1/1/2020", "stored-day"),
          entryKey: dayCreated.toString("entry-printed-date"),
          htmlString: "",
          entryType: EntryType.Journal,
        },
        { projectState: state }
      );

      let objectHighlight = createHighlight(
        {
          dayCreated: IpsumDay.fromString("1/1/2020", "stored-day"),
          entryKey: objectHighlightEntry.entryKey,
        },
        { projectState: state }
      );

      const comment = createComment(
        {
          dayCreated,
          objectHighlight: objectHighlight.id,
          htmlString: "<div>hello world</div>",
        },
        { projectState: state }
      );

      const sourceEntryKey = comment.sourceEntry;
      const sourceEntry = state.collection("entries").get(sourceEntryKey);

      const sourceEntryCurrentHTML = IpsumTimeMachine.fromString(
        sourceEntry.trackedHTMLString
      ).currentValue;

      objectHighlight = state.collection("highlights").get(objectHighlight.id);

      const relation = Object.values(
        state
          .collection("relations")
          .getAllByField("object", objectHighlight.id)
      )[0];

      expect(state.collection("comments").get(comment.id)).toEqual(comment);
      expect(comment.objectHighlight).toEqual(objectHighlight.id);

      expect(objectHighlight).toBeDefined();
      expect(objectHighlight.entry).toEqual(
        dayCreated.toString("entry-printed-date")
      );
      expect(objectHighlight.incomingRelations).toEqual([relation.id]);

      expect(comment.outgoingRelations).toEqual([relation.id]);

      expect(sourceEntry).toBeDefined();
      expect(sourceEntry.entryKey).toEqual(
        dayCreated.toString("entry-printed-date")
      );
      expect(sourceEntry.entryType).toEqual("JOURNAL");
      expect(sourceEntryCurrentHTML).toEqual(
        `<div data-comment-id="${comment.id}"><div>hello world</div></div>`
      );
    });

    test("if the entry for the day created exists, should append HTML string to existing entry", () => {
      const state = new ProjectState();
      const dayCreated = IpsumDay.fromString("1/7/2020", "stored-day");

      const journalEntry = createEntry(
        {
          dayCreated,
          entryKey: dayCreated.toString("entry-printed-date"),
          htmlString: "<div>hello world</div>",
          entryType: EntryType.Journal,
        },
        { projectState: state }
      );

      const objectHighlight = createHighlight(
        {
          dayCreated,
          entryKey: journalEntry.entryKey,
        },
        { projectState: state }
      );

      const comment = createComment(
        {
          dayCreated,
          objectHighlight: objectHighlight.id,
          htmlString: "<div>goodbye world</div>",
        },
        { projectState: state }
      );

      const sourceEntry = state.collection("entries").get(comment.sourceEntry);

      const sourceHighlightEntryCurrentHTML = IpsumTimeMachine.fromString(
        sourceEntry.trackedHTMLString
      ).currentValue;

      expect(sourceHighlightEntryCurrentHTML).toEqual(
        `<div>hello world</div><div data-comment-id="${comment.id}"><div>goodbye world</div></div>`
      );
    });
  });

  describe("deleteComment", () => {
    test("removes comment from the state and updates the source entry", () => {
      const state = new ProjectState();
      const dayCreated = IpsumDay.fromString("1/7/2020", "stored-day");

      const journalEntry = createEntry(
        {
          dayCreated,
          entryKey: dayCreated.toString("entry-printed-date"),
          htmlString: "<p>hello world</p>",
          entryType: EntryType.Journal,
        },
        { projectState: state }
      );

      const objectHighlight = createHighlight(
        {
          dayCreated,
          entryKey: journalEntry.entryKey,
        },
        { projectState: state }
      );

      const comment = createComment(
        {
          dayCreated,
          objectHighlight: objectHighlight.id,
          htmlString: "<p>goodbye world</p>",
        },
        { projectState: state }
      );

      deleteComment({ id: comment.id }, { projectState: state });

      expect(state.collection("comments").has(comment.id)).toBeFalsy();

      const updatedSourceEntry = state
        .collection("entries")
        .get(comment.sourceEntry);

      const updatedSourceEntryCurrentHTML = IpsumTimeMachine.fromString(
        updatedSourceEntry.trackedHTMLString
      ).currentValue;

      expect(updatedSourceEntryCurrentHTML).toEqual("<p>hello world</p>");
    });

    test("deletes the source entry if it ends up being empty", () => {
      const state = new ProjectState();
      const dayCreated = IpsumDay.fromString("1/7/2020", "stored-day");

      const journalEntry = createEntry(
        {
          dayCreated,
          entryKey: dayCreated.toString("entry-printed-date"),
          htmlString: "<p></p>",
          entryType: EntryType.Journal,
        },
        { projectState: state }
      );

      const objectHighlight = createHighlight(
        {
          dayCreated,
          entryKey: journalEntry.entryKey,
        },
        { projectState: state }
      );

      const comment = createComment(
        {
          dayCreated,
          objectHighlight: objectHighlight.id,
          htmlString: "<p>goodbye world</p>",
        },
        { projectState: state }
      );

      deleteComment({ id: comment.id }, { projectState: state });

      expect(state.collection("entries").has(comment.sourceEntry)).toBeFalsy();
    });
  });
});
