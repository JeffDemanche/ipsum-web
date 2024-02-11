import { vars, initializeState } from "util/apollo/client";
import { IpsumDay } from "util/dates";
import { createArc } from "../arcs";
import {
  createHighlight,
  deleteHighlight,
  rateHighlightImportance,
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

  describe("rateHighlightImportance", () => {
    it("should add an importance rating to the highlight", () => {
      const highlight = createHighlight({ entry: "1/2/2020" });
      rateHighlightImportance({
        highlightId: highlight.id,
        day: IpsumDay.fromString("1/2/2020", "stored-day"),
        rating: 1,
      });
      expect(vars.highlights()[highlight.id].importanceRatings).toEqual([
        { __typename: "ImportanceRating", day: "1/2/2020", value: 1 },
      ]);
    });

    it("should remove an importance rating from the highlight", () => {
      const highlight = createHighlight({ entry: "1/2/2020" });
      rateHighlightImportance({
        highlightId: highlight.id,
        day: IpsumDay.fromString("1/2/2020", "stored-day"),
        rating: 1,
      });
      rateHighlightImportance({
        highlightId: highlight.id,
        day: IpsumDay.fromString("1/3/2020", "stored-day"),
        rating: 1,
      });
      // Remove one of the ratings
      rateHighlightImportance({
        highlightId: highlight.id,
        day: IpsumDay.fromString("1/2/2020", "stored-day"),
        rating: 0,
      });
      expect(vars.highlights()[highlight.id].importanceRatings).toEqual([
        { __typename: "ImportanceRating", day: "1/3/2020", value: 1 },
      ]);
    });

    it("should add highlight to day object when adding rating", () => {
      const highlight = createHighlight({ entry: "1/2/2020" });
      rateHighlightImportance({
        highlightId: highlight.id,
        day: IpsumDay.fromString("1/2/2020", "stored-day"),
        rating: 1,
      });
      expect(vars.days()["1/2/2020"].ratedHighlights).toEqual([highlight.id]);
    });

    it("should remove highlight from day object when removing rating", () => {
      const highlight = createHighlight({ entry: "1/2/2020" });
      rateHighlightImportance({
        highlightId: highlight.id,
        day: IpsumDay.fromString("1/2/2020", "stored-day"),
        rating: 1,
      });
      rateHighlightImportance({
        highlightId: highlight.id,
        day: IpsumDay.fromString("1/2/2020", "stored-day"),
        rating: 0,
      });
      expect(vars.days()["1/2/2020"].ratedHighlights).toEqual([]);
    });
  });
});
