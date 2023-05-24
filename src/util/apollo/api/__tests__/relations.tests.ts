import { initializeState, vars } from "util/apollo/client";
import { createArc } from "../arcs";
import { createHighlight } from "../highlights";
import { createRelation } from "../relations";

jest.mock("../../autosave");

describe("apollo relations API", () => {
  beforeEach(() => {
    initializeState();
  });

  describe("createRelation", () => {
    it("should not create a relation if the subject does not exist", () => {
      expect(() =>
        createRelation({
          subject: "arc 1",
          subjectType: "Arc",
          predicate: "predicate",
          object: "arc 2",
          objectType: "Arc",
        })
      ).toThrow();
    });

    it("should create a relation and update subject and object arcs", () => {
      const { id: arc1Id } = createArc({ name: "arc 1" });
      const { id: arc2Id } = createArc({ name: "arc 2" });
      const { id } = createRelation({
        subject: arc1Id,
        subjectType: "Arc",
        predicate: "relates to",
        object: arc2Id,
        objectType: "Arc",
      });
      expect(vars.arcs()[arc1Id].outgoingRelations).toEqual([id]);
      expect(vars.arcs()[arc2Id].incomingRelations).toEqual([id]);
      expect(vars.relations()[id].predicate).toEqual("relates to");
    });

    it("should create a relation and update subject highlight and object arc", () => {
      const { id: arcId } = createArc({ name: "arc" });
      const { id: highlightId } = createHighlight({
        entry: "entry",
        arc: arcId,
      });
      const { id } = createRelation({
        subject: highlightId,
        subjectType: "Highlight",
        predicate: "relates to",
        object: arcId,
        objectType: "Arc",
      });
      expect(vars.highlights()[highlightId].outgoingRelations).toEqual([id]);
      expect(vars.arcs()[arcId].incomingRelations).toEqual([id]);
      expect(vars.relations()[id].subject).toEqual(highlightId);
      expect(vars.relations()[id].predicate).toEqual("relates to");
      expect(vars.relations()[id].object).toEqual(arcId);
    });
  });
});
