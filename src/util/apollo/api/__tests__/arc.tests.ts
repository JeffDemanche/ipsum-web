import { initializeState } from "util/apollo/client";

jest.mock("../../autosave");

describe("apollo arcs API", () => {
  beforeEach(() => {
    initializeState();
  });

  describe("createArc", () => {
    it.todo("should create an arc with default fields");

    it.todo("should create an arcEntry with default fields");
  });

  describe("updateArc", () => {});

  describe("deleteArc", () => {
    it.todo("should delete the arc and any associated arc entries");
  });
});
