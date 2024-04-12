import { initializeState, vars } from "util/apollo/client";

import { createArcEntry, deleteArcEntry } from "../arcEntries";

jest.mock("../../autosave");

describe("apollo arcEntries API", () => {
  beforeEach(() => {
    initializeState();
  });

  describe("createArcEntry", () => {
    it("should create an arcEntry with arc and entry objects referenced", () => {
      const arcEntry = createArcEntry({ arcId: "arcId", arcName: "arcName" });

      expect(vars.arcEntries()[arcEntry.entry]).toEqual(
        expect.objectContaining({
          __typename: "ArcEntry",
          arc: "arcId",
          entry: arcEntry.entry,
        })
      );
    });
  });

  describe("deleteArcEntry", () => {
    it("should also delete the underlying entry", () => {
      const arcEntry = createArcEntry({ arcId: "arcId", arcName: "arcName" });
      expect(vars.arcEntries()[arcEntry.entry]).toBeDefined();
      expect(vars.entries()[arcEntry.entry]).toBeDefined();

      deleteArcEntry(arcEntry.entry);

      expect(vars.arcEntries()[arcEntry.entry]).toBeUndefined();
      expect(vars.entries()[arcEntry.entry]).toBeUndefined();
    });
  });
});
