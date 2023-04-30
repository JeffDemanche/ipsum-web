import { vars, initializeState } from "util/apollo/client";
import {
  createHighlight,
  deleteHighlight,
  updateHighlight,
} from "../highlights";

jest.mock("../../autosave");

describe("apollo highlights API", () => {
  beforeEach(() => {
    initializeState();
  });

  describe("createHighlight", () => {
    it("should add highlights to the state", () => {
      const highlight1 = createHighlight({ arc: "1", entry: "1/2/2020" });
      expect(vars.highlights()).toEqual({ [highlight1.id]: highlight1 });
      const highlight2 = createHighlight({
        arc: "2",
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
        arc: "1",
        entry: "1/2/2020",
      });
      const highlight2 = createHighlight({
        arc: "2",
        entry: "1/2/2020",
      });
      expect(vars.highlights()).toEqual({
        [highlight1.id]: highlight1,
        [highlight2.id]: highlight2,
      });
      updateHighlight({ id: highlight1.id, arc: "3" });
      expect(vars.highlights()).toEqual({
        [highlight1.id]: { ...highlight1, arc: "3" },
        [highlight2.id]: highlight2,
      });
    });
  });

  describe("deleteHighlight", () => {
    it("should delete highlights from the state", () => {
      const highlight1 = createHighlight({
        arc: "1",
        entry: "1/2/2020",
      });
      const highlight2 = createHighlight({ arc: "2", entry: "1/2/2020" });
      expect(vars.highlights()).toEqual({
        [highlight1.id]: highlight1,
        [highlight2.id]: highlight2,
      });
      deleteHighlight(highlight1.id);
      expect(vars.highlights()).toEqual({ [highlight2.id]: highlight2 });
    });
  });
});
