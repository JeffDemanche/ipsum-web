import { vars, initializeState } from "util/apollo/client";
import {
  createHighlight,
  deleteHighlight,
  updateHighlight,
} from "../highlights";

describe("apollo highlights API", () => {
  beforeEach(() => {
    initializeState();
  });

  describe("createHighlight", () => {
    it("should add highlights to the state", () => {
      const highlight1 = {
        __typename: "Highlight",
        id: "1",
        arc: "1",
        entry: "1/2/2020",
      };
      const highlight2 = {
        __typename: "Highlight",
        id: "2",
        arc: "2",
        entry: "1/2/2020",
      };
      createHighlight(highlight1);
      expect(vars.highlights()).toEqual({ "1": highlight1 });
      createHighlight(highlight2);
      expect(vars.highlights()).toEqual({ "1": highlight1, "2": highlight2 });
    });
  });

  describe("updateHighlight", () => {
    it("should update highlights in the state", () => {
      const highlight1 = {
        __typename: "Highlight",
        id: "1",
        arc: "1",
        entry: "1/2/2020",
      };
      const highlight2 = {
        __typename: "Highlight",
        id: "2",
        arc: "2",
        entry: "1/2/2020",
      };
      createHighlight(highlight1);
      createHighlight(highlight2);
      expect(vars.highlights()).toEqual({ "1": highlight1, "2": highlight2 });
      updateHighlight({ id: "1", arc: "3" });
      expect(vars.highlights()).toEqual({
        "1": { ...highlight1, arc: "3" },
        "2": highlight2,
      });
    });
  });

  describe("deleteHighlight", () => {
    it("should delete highlights from the state", () => {
      const highlight1 = {
        __typename: "Highlight",
        id: "1",
        arc: "1",
        entry: "1/2/2020",
      };
      const highlight2 = {
        __typename: "Highlight",
        id: "2",
        arc: "2",
        entry: "1/2/2020",
      };
      createHighlight(highlight1);
      createHighlight(highlight2);
      expect(vars.highlights()).toEqual({ "1": highlight1, "2": highlight2 });
      deleteHighlight("1");
      expect(vars.highlights()).toEqual({ "2": highlight2 });
    });
  });
});
