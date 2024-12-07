import { EntryType } from "util/apollo";
import { IpsumDay } from "util/dates";
import { IpsumTimeMachine } from "util/diff";
import { ProjectState } from "util/state";

import { createComment } from "../comment/create-comment";
import { createEntry } from "../entry/create-entry";
import { createHighlight } from "../highlight/create-highlight";

describe("API comment actions", () => {
  describe("createComment", () => {
    it("should create a comment, highlight, and entry for the day created if it doesn't exist", () => {
      const state = new ProjectState();
      const dayCreated = IpsumDay.fromString("1/7/2020", "stored-day");

      const subjectHighlightEntry = createEntry(
        {
          dayCreated: IpsumDay.fromString("1/1/2020", "stored-day"),
          entryKey: dayCreated.toString("entry-printed-date"),
          htmlString: "",
          entryType: EntryType.Journal,
        },
        { projectState: state }
      );

      const subjectHighlight = createHighlight(
        {
          dayCreated,
          entryKey: subjectHighlightEntry.entryKey,
        },
        { projectState: state }
      );

      const comment = createComment(
        {
          dayCreated,
          highlight: subjectHighlight.id,
          highlightDay: dayCreated,
          htmlString: "<div>hello world</div>",
        },
        { projectState: state }
      );

      const commentHighlight = state
        .collection("highlights")
        .get(comment.commentHighlight);

      const commentHighlightEntry = state
        .collection("entries")
        .get(commentHighlight.entry);

      const commentHighlightEntryCurrentHTML = IpsumTimeMachine.fromString(
        commentHighlightEntry.trackedHTMLString
      ).currentValue;

      expect(state.collection("comments").get(comment.id)).toEqual(comment);
      expect(comment.highlight).toEqual(subjectHighlight.id);

      expect(commentHighlight).toBeDefined();
      expect(commentHighlight.entry).toEqual(
        dayCreated.toString("entry-printed-date")
      );

      expect(commentHighlightEntry).toBeDefined();
      expect(commentHighlightEntry.entryKey).toEqual(
        dayCreated.toString("entry-printed-date")
      );
      expect(commentHighlightEntry.entryType).toEqual("JOURNAL");
      expect(commentHighlightEntryCurrentHTML).toEqual(
        "<div>hello world</div>"
      );
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

      const highlight = createHighlight(
        {
          dayCreated,
          entryKey: journalEntry.entryKey,
        },
        { projectState: state }
      );

      const comment = createComment(
        {
          dayCreated,
          highlight: highlight.id,
          highlightDay: dayCreated,
          htmlString: "<div>goodbye world</div>",
        },
        { projectState: state }
      );

      const commentHighlight = state
        .collection("highlights")
        .get(comment.commentHighlight);

      const commentHighlightEntry = state
        .collection("entries")
        .get(commentHighlight.entry);

      const commentHighlightEntryCurrentHTML = IpsumTimeMachine.fromString(
        commentHighlightEntry.trackedHTMLString
      ).currentValue;

      expect(commentHighlightEntryCurrentHTML).toEqual(
        "<div>hello world</div><div>goodbye world</div>"
      );
    });
  });
});
