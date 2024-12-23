import { EntryType } from "util/apollo";
import { IpsumDay } from "util/dates";
import { ProjectState } from "util/state";

import { apiCreateEntry, apiCreateHighlight } from "..";
import { createArc } from "../arc/create-arc";
import { createComment } from "../comment/create-comment";
import { createEntry } from "../entry/create-entry";
import { createHighlight } from "../highlight/create-highlight";
import { deleteHighlight } from "../highlight/delete-highlight";
import { createRelationFromHighlightToArc } from "../relation/create-relation-from-highlight-to-arc";

describe("API highlight actions", () => {
  describe("createHighlight", () => {
    test("should reject if the entry does not exist", () => {
      const state = new ProjectState();
      const dayCreated = IpsumDay.fromString("1/7/2020", "stored-day");

      expect(() =>
        apiCreateHighlight(
          { entryKey: "entry-key", dayCreated },
          { projectState: state }
        )
      ).toThrowError("No entry with key entry-key exists in the project state");
    });

    test("should create a highlight", () => {
      const state = new ProjectState();
      const dayCreated = IpsumDay.fromString("1/7/2020", "stored-day");

      apiCreateEntry(
        {
          entryKey: "entry-key",
          dayCreated,
          htmlString: "<div>hello world</div>",
          entryType: EntryType.Journal,
        },
        { projectState: state }
      );
      const highlight = apiCreateHighlight(
        { entryKey: "entry-key", dayCreated },
        { projectState: state }
      );

      const highlightInState = state.collection("highlights").get(highlight.id);
      expect(highlightInState).toEqual(highlight);
      expect(highlightInState.entry).toEqual("entry-key");
      expect(highlightInState.history.dateCreated).toEqual(
        dayCreated.toString("iso")
      );
    });
  });

  describe("deleteHighlight", () => {
    test("should remove all comments associated with the highlight", () => {
      const state = new ProjectState();
      const dayCreated = IpsumDay.fromString("1/7/2020", "stored-day");

      apiCreateEntry(
        {
          entryKey: "entry-key",
          dayCreated,
          htmlString: "<div>hello world</div>",
          entryType: EntryType.Journal,
        },
        { projectState: state }
      );
      const highlight = apiCreateHighlight(
        { entryKey: "entry-key", dayCreated },
        { projectState: state }
      );

      const comment = createComment(
        {
          objectHighlight: highlight.id,
          htmlString: "<div>hello world</div>",
          dayCreated,
        },
        { projectState: state }
      );

      expect(state.collection("comments").has(comment.id)).toBeTruthy();

      deleteHighlight({ id: highlight.id }, { projectState: state });

      expect(state.collection("comments").has(comment.id)).toBeFalsy();
    });

    test("should remove incoming relations from arcs associated with the highlight", () => {
      const state = new ProjectState();
      const dayCreated = IpsumDay.fromString("1/7/2020", "stored-day");

      createEntry(
        {
          entryKey: "entry-key",
          dayCreated,
          htmlString: "<div>hello world</div>",
          entryType: EntryType.Journal,
        },
        { projectState: state }
      );
      const highlight = createHighlight(
        { entryKey: "entry-key", dayCreated },
        { projectState: state }
      );

      const arc = createArc(
        {
          name: "arc",
          id: "arc-id",
        },
        { projectState: state }
      );

      createRelationFromHighlightToArc(
        {
          arcId: arc.id,
          highlightId: highlight.id,
          predicate: "relates to",
        },
        { projectState: state }
      );

      const incomingRelationsBefore = state
        .collection("arcs")
        .get(arc.id).incomingRelations;

      deleteHighlight({ id: highlight.id }, { projectState: state });

      const incomingRelationsAfter = state
        .collection("arcs")
        .get(arc.id).incomingRelations;

      expect(incomingRelationsBefore).toHaveLength(1);
      expect(incomingRelationsAfter).toHaveLength(0);
    });
  });
});
