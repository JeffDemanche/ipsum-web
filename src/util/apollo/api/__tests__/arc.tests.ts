import { initializeState } from "util/apollo/client";

jest.mock("../../autosave");

describe("apollo arcs API", () => {
  beforeEach(() => {
    initializeState();
  });

  describe("createArc", () => {
    it("should create an arc with default fields", () => {});

    it("should create an arcEntry with default fields", () => {});
  });

  describe("updateArc", () => {});

  describe("deleteArc", () => {
    it("should delete the arc and any associated arc entries", () => {});
  });
});
