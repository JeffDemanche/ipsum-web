import { initializeState } from "util/apollo/client";
import { createArcEntry } from "../arcEntries";

jest.mock("../../autosave");

describe("apollo arcEntries API", () => {
  beforeEach(() => {
    initializeState();
  });

  describe("createArcEntry", () => {
    it("should create an arcEntry with an empty trackedContentState", () => {
      const arcEntry = createArcEntry({ arcId: "arcId", arcName: "arcName" });
    });
  });

  describe("updateArcEntry", () => {
    it.todo(
      "should correctly update the trackedContentState when overwriting on a day"
    );

    it.todo(
      "should correctly update the trackedContentState when adding a new day"
    );

    it.todo(
      "should throw when updating a day before the most recent day on the trackedContentState"
    );
  });

  describe("deleteArcEntry", () => {
    it.todo("should also delete the underlying entry");
  });
});
