import { IpsumDay } from "util/dates";
import { ProjectState } from "util/state";

import { apiCreateArc } from "..";

describe("API arc actions", () => {
  describe("createArc", () => {
    test("should create an arc and entry", () => {
      const state = new ProjectState();
      const dayCreated = IpsumDay.fromString("1/7/2020", "stored-day");

      const arc = apiCreateArc(
        { hue: 17, name: "attachment", dayCreated },
        { projectState: state }
      );

      const arcInState = state.collection("arcs").get(arc.id);
      const arcEntryKey = `arc-entry:attachment:${arc.id}`;

      expect(arcInState).toEqual(arc);
      expect(arcInState.color).toEqual(17);
      expect(arcInState.arcEntry).toEqual(arcEntryKey);
      expect(arcInState.history.dateCreated).toEqual(
        dayCreated.toString("iso")
      );

      const arcEntry = state.collection("arcEntries").get(arcEntryKey);
      expect(arcEntry).toBeDefined();
      expect(arcEntry.entry).toBeDefined();
      expect(arcEntry.entry).toEqual(arcEntryKey);

      const entry = state.collection("entries").get(arcEntryKey);
      expect(entry).toBeDefined();
      expect(entry.entryKey).toEqual(arcEntryKey);
    });
  });
});
