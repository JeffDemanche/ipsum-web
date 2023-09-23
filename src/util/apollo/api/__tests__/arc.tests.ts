import { initializeState, vars } from "util/apollo/client";
import { IpsumDateTime } from "util/dates";
import { createArc, deleteArc } from "../arcs";
import { createRelation } from "../relations";

jest.mock("../../autosave");

describe("apollo arcs API", () => {
  beforeEach(() => {
    initializeState();
  });

  describe("createArc", () => {
    it("should create an arc with default fields", () => {
      const arc = createArc({ name: "test" });
      expect(arc).toEqual(
        expect.objectContaining({
          __typename: "Arc",
          name: "test",
          history: {
            __typename: "History",
            dateCreated: IpsumDateTime.today().toString("iso"),
          },
        })
      );
      expect(arc.arcEntry).toBeDefined();
    });

    it("should create an arcEntry with default fields", () => {
      const arc = createArc({ name: "test" });
      expect(vars.arcEntries()[arc.arcEntry]).toEqual(
        expect.objectContaining({
          __typename: "ArcEntry",
          arc: arc.id,
          entry: arc.arcEntry,
        })
      );
    });
  });

  describe("updateArc", () => {});

  describe("deleteArc", () => {
    it("should delete the arc and any associated arc entries", () => {
      const arc = createArc({ name: "test" });
      const arcEntryKey = arc.arcEntry;
      expect(vars.arcs()[arc.id]).toBeDefined();
      expect(vars.arcEntries()[arcEntryKey]).toBeDefined();

      deleteArc(arc.id);

      expect(vars.arcs()[arc.id]).toBeUndefined();
      expect(vars.arcEntries()[arcEntryKey]).toBeUndefined();
    });

    it("should delete any relations associated with the arc", () => {
      const arc1 = createArc({ name: "test" });
      const arc2 = createArc({ name: "test" });
      const relation = createRelation({
        subject: arc1.id,
        subjectType: "Arc",
        predicate: "relates to",
        object: arc2.id,
        objectType: "Arc",
      });

      expect(vars.relations()[relation.id]).toBeDefined();
      deleteArc(arc1.id);
      expect(vars.relations()[relation.id]).toBeUndefined();
    });
  });
});
