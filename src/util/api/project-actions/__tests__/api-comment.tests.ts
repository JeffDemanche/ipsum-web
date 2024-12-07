import { EntryType } from "util/apollo";
import { IpsumDay } from "util/dates";
import { IpsumTimeMachine } from "util/diff";
import { ProjectState } from "util/state";

import { createComment } from "../comment/create-comment";
import { createEntry } from "../entry/create-entry";
import { createHighlight } from "../highlight/create-highlight";

describe("API comment actions", () => {
  describe("createComment", () => {
    it("should create a comment, highlight, relation, and entry for the day created if it doesn't exist", () => {
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

      const sourceHighlight = state
        .collection("highlights")
        .get(comment.sourceHighlight);

      const sourceHighlightEntry = state
        .collection("entries")
        .get(sourceHighlight.entry);

      const sourceHighlightEntryCurrentHTML = IpsumTimeMachine.fromString(
        sourceHighlightEntry.trackedHTMLString
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

      expect(sourceHighlight.outgoingRelations).toEqual([relation.id]);

      expect(sourceHighlightEntry).toBeDefined();
      expect(sourceHighlightEntry.entryKey).toEqual(
        dayCreated.toString("entry-printed-date")
      );
      expect(sourceHighlightEntry.entryType).toEqual("JOURNAL");
      expect(sourceHighlightEntryCurrentHTML).toEqual("<div>hello world</div>");
    });

    it("if the entry for the day created exists, should append HTML string to existing entry", () => {
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

      const sourceHighlight = state
        .collection("highlights")
        .get(comment.sourceHighlight);

      const sourceHighlightEntry = state
        .collection("entries")
        .get(sourceHighlight.entry);

      const sourceHighlightEntryCurrentHTML = IpsumTimeMachine.fromString(
        sourceHighlightEntry.trackedHTMLString
      ).currentValue;

      expect(sourceHighlightEntryCurrentHTML).toEqual(
        "<div>hello world</div><div>goodbye world</div>"
      );
    });
  });
});
