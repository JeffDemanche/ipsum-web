import { ProjectState } from "../project-state";

describe("ProjectState", () => {
  it("initializes with empty state", () => {
    const state = new ProjectState();
    expect(state.collection("days").toObject()).toEqual({});
  });

  describe("crud operations", () => {
    it("creates a new entry", () => {
      const state = new ProjectState();
      state.collection("arcs").create("1", {
        __typename: "Arc",
        id: "1",
        name: "arc1",
        arcEntry: "1",
        color: 0,
        history: { __typename: "History", dateCreated: "" },
        incomingRelations: [],
        outgoingRelations: [],
      });
      expect(state.collection("arcs").toObject()).toEqual({
        "1": {
          __typename: "Arc",
          id: "1",
          name: "arc1",
          arcEntry: "1",
          color: 0,
          history: { __typename: "History", dateCreated: "" },
          incomingRelations: [],
          outgoingRelations: [],
        },
      });
    });
  });
});
