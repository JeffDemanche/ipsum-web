import { EntryType } from "util/apollo";
import { IpsumDay } from "util/dates";
import { ProjectState } from "util/state";

import { createComment } from "../comment/create-comment";
import { deleteComment } from "../comment/delete-comment";
import { createEntry } from "../entry/create-entry";
import { createHighlight } from "../highlight/create-highlight";

describe("API comment actions", () => {
  describe("createComment", () => {
    test("should create a comment, commentEntry, and add comment to day object", () => {
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
          htmlString: "<p>hello world</p>",
          objectHighlight: objectHighlight.id,
        },
        { projectState: state }
      );

      const commentEntry = state
        .collection("commentEntries")
        .get(`comment-entry:${comment.id}`);

      const day = state
        .collection("days")
        .get(dayCreated.toString("stored-day"));

      expect(state.collection("comments").has(comment.id)).toBeTruthy();
      expect(commentEntry).toBeDefined();
      expect(day.comments).toContain(comment.id);
    });

    test("should not create comment if one already exists on the highlight for day", () => {
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

      createComment(
        {
          dayCreated,
          htmlString: "<p>hello world</p>",
          objectHighlight: objectHighlight.id,
        },
        { projectState: state }
      );

      expect(() =>
        createComment(
          {
            dayCreated,
            htmlString: "<p>hello world</p>",
            objectHighlight: objectHighlight.id,
          },
          { projectState: state }
        )
      ).toThrowError();
    });
  });

  describe("deleteComment", () => {
    test("removes comment and commentEntry from the state and updates the day object", () => {
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

      const day = state
        .collection("days")
        .get(dayCreated.toString("stored-day"));

      const commentEntry = state
        .collection("commentEntries")
        .get(`comment-entry:${comment.id}`);

      expect(state.collection("comments").has(comment.id)).toBeFalsy();
      expect(commentEntry).toBeUndefined();
      expect(day.comments).not.toContain(comment.id);
    });
  });
});
