import { EntryType } from "util/apollo";
import { IpsumDay } from "util/dates";
import { ProjectState } from "util/state";

import {
  apiCreateArc,
  apiCreateEntry,
  apiCreateHighlight,
  apiCreateRelationFromArcToArc,
  apiCreateRelationFromHighlightToArc,
  apiDeleteRelationFromArcToArc,
  apiDeleteRelationFromHighlightToArc,
} from "..";

describe("API relation actions", () => {
  describe("highlight as subject", () => {
    describe("createRelationFromHighlightToArc", () => {
      it("should reject if the highlight does not exist", () => {
        const state = new ProjectState();

        expect(() =>
          apiCreateRelationFromHighlightToArc(
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
          apiCreateRelationFromHighlightToArc(
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

        const relation = apiCreateRelationFromHighlightToArc(
          { highlightId: highlight.id, arcId: arc.id, predicate: "relates to" },
          { projectState: state }
        );

        const relationInState = state.collection("relations").get(relation.id);
        expect(relationInState).toEqual(relation);
        expect(relationInState.object).toEqual(arc.id);
        expect(relationInState.subject).toEqual(highlight.id);
      });

      it("should update subject and object outgoing and incoming relations, respectively", () => {
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

        apiCreateRelationFromHighlightToArc(
          { highlightId: highlight.id, arcId: arc.id, predicate: "relates to" },
          { projectState: state }
        );

        const highlightInState = state
          .collection("highlights")
          .get(highlight.id);
        const arcInState = state.collection("arcs").get(arc.id);

        expect(highlightInState.outgoingRelations).toEqual(
          expect.arrayContaining([expect.any(String)])
        );
        expect(arcInState.incomingRelations).toEqual(
          expect.arrayContaining([expect.any(String)])
        );
      });
    });

    describe("deleteRelationFromHighlightToArc", () => {
      it("should reject if the relation does not exist", () => {
        const state = new ProjectState();

        expect(() =>
          apiCreateRelationFromHighlightToArc(
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

      it("should delete a relation from a highlight to an arc, and update incoming/outgoing relation fields", () => {
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

        const relation = apiCreateRelationFromHighlightToArc(
          { highlightId: highlight.id, arcId: arc.id, predicate: "relates to" },
          { projectState: state }
        );

        const result = apiDeleteRelationFromHighlightToArc(
          { id: relation.id },
          { projectState: state }
        );

        expect(result).toBe(true);
        expect(state.collection("relations").has(relation.id)).toBe(false);

        const highlightInState = state
          .collection("highlights")
          .get(highlight.id);
        const arcInState = state.collection("arcs").get(arc.id);

        expect(highlightInState.outgoingRelations).toEqual([]);
        expect(arcInState.incomingRelations).toEqual([]);
      });
    });
  });

  describe("arc as subject", () => {
    describe("createRelationFromArcToArc", () => {
      it("should reject if the subject arc does not exist", () => {
        const state = new ProjectState();

        expect(() =>
          apiCreateRelationFromArcToArc(
            {
              subjectArcId: "subject-arc-id",
              objectArcId: "object-arc-id",
              predicate: "relates to",
            },
            { projectState: state }
          )
        ).toThrowError(
          "No arc with id subject-arc-id exists in the project state"
        );
      });

      it("should reject if the object arc does not exist", () => {
        const state = new ProjectState();
        const dayCreated = IpsumDay.fromString("1/7/2020", "stored-day");

        const arc = apiCreateArc(
          { hue: 17, name: "attachment", dayCreated },
          { projectState: state }
        );

        expect(() =>
          apiCreateRelationFromArcToArc(
            {
              subjectArcId: arc.id,
              objectArcId: "object-arc-id",
              predicate: "relates to",
            },
            { projectState: state }
          )
        ).toThrowError(
          "No arc with id object-arc-id exists in the project state"
        );
      });

      it("should create a relation from an arc to an arc and update both arc's relation fields", () => {
        const state = new ProjectState();
        const dayCreated = IpsumDay.fromString("1/7/2020", "stored-day");

        const subjectArc = apiCreateArc(
          { hue: 17, name: "attachment", dayCreated },
          { projectState: state }
        );
        const objectArc = apiCreateArc(
          { hue: 17, name: "suffering", dayCreated },
          { projectState: state }
        );

        const relation = apiCreateRelationFromArcToArc(
          {
            subjectArcId: subjectArc.id,
            objectArcId: objectArc.id,
            predicate: "relates to",
          },
          { projectState: state }
        );

        const relationInState = state.collection("relations").get(relation.id);
        expect(relationInState).toEqual(relation);
        expect(relationInState.objectType).toEqual("Arc");
        expect(relationInState.object).toEqual(objectArc.id);
        expect(relationInState.subjectType).toEqual("Arc");
        expect(relationInState.subject).toEqual(subjectArc.id);

        const subjectArcInState = state.collection("arcs").get(subjectArc.id);
        const objectArcInState = state.collection("arcs").get(objectArc.id);

        expect(subjectArcInState.outgoingRelations).toEqual(
          expect.arrayContaining([expect.any(String)])
        );
        expect(objectArcInState.incomingRelations).toEqual(
          expect.arrayContaining([expect.any(String)])
        );
      });
    });

    describe("deleteRelationFromArcToArc", () => {
      it("should reject if the relation does not exist", () => {
        const state = new ProjectState();

        expect(() =>
          apiDeleteRelationFromArcToArc(
            {
              id: "relation-id",
            },
            { projectState: state }
          )
        ).toThrowError(
          "No relation with id relation-id exists in the project state"
        );
      });

      it("should delete a relation from an arc to an arc, and update incoming/outgoing relation fields", () => {
        const state = new ProjectState();
        const dayCreated = IpsumDay.fromString("1/7/2020", "stored-day");

        const subjectArc = apiCreateArc(
          { hue: 17, name: "attachment", dayCreated },
          { projectState: state }
        );
        const objectArc = apiCreateArc(
          { hue: 17, name: "suffering", dayCreated },
          { projectState: state }
        );

        const relation = apiCreateRelationFromArcToArc(
          {
            subjectArcId: subjectArc.id,
            objectArcId: objectArc.id,
            predicate: "relates to",
          },
          { projectState: state }
        );

        const result = apiDeleteRelationFromArcToArc(
          { id: relation.id },
          { projectState: state }
        );

        expect(result).toBe(true);
        expect(state.collection("relations").has(relation.id)).toBe(false);

        const subjectArcInState = state.collection("arcs").get(subjectArc.id);
        const objectArcInState = state.collection("arcs").get(objectArc.id);

        expect(subjectArcInState.outgoingRelations).toEqual([]);
        expect(objectArcInState.incomingRelations).toEqual([]);
      });
    });
  });
});
