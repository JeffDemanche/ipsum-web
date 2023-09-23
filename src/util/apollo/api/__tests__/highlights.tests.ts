import { vars, initializeState } from "util/apollo/client";
import { createArc } from "../arcs";
import {
  createHighlight,
  deleteHighlight,
  updateHighlight,
} from "../highlights";
import { createRelation } from "../relations";

jest.mock("../../autosave");

describe("apollo highlights API", () => {
  beforeEach(() => {
    initializeState();
  });

  describe("createHighlight", () => {
    it("should add highlights to the state", () => {
      const highlight1 = createHighlight({
        entry: "1/2/2020",
      });
      expect(vars.highlights()).toEqual({ [highlight1.id]: highlight1 });
      const highlight2 = createHighlight({
        entry: "1/2/2020",
      });
      expect(vars.highlights()).toEqual({
        [highlight1.id]: highlight1,
        [highlight2.id]: highlight2,
      });
    });
  });

  describe("updateHighlight", () => {
    it("should update highlights in the state", () => {
      const highlight1 = createHighlight({
        entry: "1/2/2020",
      });
      const highlight2 = createHighlight({
        entry: "1/2/2020",
      });
      expect(vars.highlights()).toEqual({
        [highlight1.id]: highlight1,
        [highlight2.id]: highlight2,
      });
      updateHighlight({
        id: highlight1.id,
        outgoingRelations: ["nonexistant_relation"],
      });
      expect(vars.highlights()).toEqual({
        [highlight1.id]: {
          ...highlight1,
          outgoingRelations: ["nonexistant_relation"],
        },
        [highlight2.id]: highlight2,
      });
    });
  });

  describe("deleteHighlight", () => {
    it("should delete highlights from the state", () => {
      const highlight1 = createHighlight({
        entry: "1/2/2020",
      });
      const highlight2 = createHighlight({ entry: "1/2/2020" });
      expect(vars.highlights()).toEqual({
        [highlight1.id]: highlight1,
        [highlight2.id]: highlight2,
      });
      deleteHighlight(highlight1.id);
      expect(vars.highlights()).toEqual({ [highlight2.id]: highlight2 });
    });

    it("should remove relations that connect to or from the highlight", () => {
      const highlight = createHighlight({ entry: "1/2/2020" });
      const arc = createArc({ name: "arc" });
      const relation = createRelation({
        subject: highlight.id,
        subjectType: "Highlight",
        predicate: "relates to",
        object: arc.id,
        objectType: "Arc",
      });
      expect(vars.relations()).toEqual({ [relation.id]: relation });
      deleteHighlight(highlight.id);
      expect(vars.relations()).toEqual({});
    });
  });
});
