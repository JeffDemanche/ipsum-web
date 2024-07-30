import { EntryType } from "util/apollo";
import { IpsumDay } from "util/dates";
import { ProjectState } from "util/state";

import {
  apiCreateArc,
  apiCreateEntry,
  apiCreateHighlight,
  apiCreateRelationFromHighlight,
} from "..";

describe("API highlight actions", () => {
  describe("createHighlight", () => {
    it("should reject if the entry does not exist", () => {
      const state = new ProjectState();
      const dayCreated = IpsumDay.fromString("1/7/2020", "stored-day");

      expect(() =>
        apiCreateHighlight(
          { entryKey: "entry-key", dayCreated },
          { projectState: state }
        )
      ).toThrowError("No entry with key entry-key exists in the project state");
    });

    it("should create a highlight", () => {
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

  describe("createRelationFromHighlight", () => {
    it("should reject if the highlight does not exist", () => {
      const state = new ProjectState();

      expect(() =>
        apiCreateRelationFromHighlight(
          {
            highlightId: "highlight-id",
            arcId: "arc-id",
            predicate: "relates to",
          },
          { projectState: state }
        )
      ).toThrowError(
        "No highlight with id highlight-id exists in the project state"
      );
    });

    it("should reject if the arc does not exist", () => {
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

      expect(() =>
        apiCreateRelationFromHighlight(
          {
            highlightId: highlight.id,
            arcId: "arc-id",
            predicate: "relates to",
          },
          { projectState: state }
        )
      ).toThrowError("No arc with id arc-id exists in the project state");
    });

    it("should create a relation from a highlight to an arc", () => {
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
      const arc = apiCreateArc(
        { hue: 17, name: "attachment", dayCreated },
        { projectState: state }
      );

      const relation = apiCreateRelationFromHighlight(
        { highlightId: highlight.id, arcId: arc.id, predicate: "relates to" },
        { projectState: state }
      );

      const relationInState = state.collection("relations").get(relation.id);
      expect(relationInState).toEqual(relation);
      expect(relationInState.object).toEqual(arc.id);
      expect(relationInState.subject).toEqual(highlight.id);
    });
  });
});
