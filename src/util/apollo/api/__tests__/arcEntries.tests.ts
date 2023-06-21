import { initializeState } from "util/apollo/client";

describe("apollo arcEntries API", () => {
  beforeEach(() => {
    initializeState();
  });

  describe("createArcEntry", () => {
    it("should create an arcEntry with an empty trackedContentState", () => {});
  });

  describe("updateArcEntry", () => {
    it("should correctly update the trackedContentState when overwriting on a day", () => {});

    it("should correctly update the trackedContentState when adding a new day", () => {});

    it("should throw when updating a day before the most recent day on the trackedContentState", () => {});
  });
});
