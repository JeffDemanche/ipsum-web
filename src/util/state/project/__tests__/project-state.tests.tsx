import { useReactiveVar } from "@apollo/client";
import { act, render } from "@testing-library/react";
import React from "react";

import { ProjectState } from "../project-state";

// Something weird with circular dependencies that probably means this module
// isn't properly decoupled.
jest.mock("util/serializer", () => ({}));

describe("ProjectState", () => {
  it("initializes with empty state", () => {
    const state = new ProjectState();
    expect(state.collection("days").toObject()).toEqual({});
  });

  describe("react updates", () => {
    let state: ProjectState;

    beforeEach(() => {
      state = new ProjectState();

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
      state.collection("arcs").create("2", {
        __typename: "Arc",
        id: "2",
        name: "arc2",
        arcEntry: "1",
        color: 0,
        history: { __typename: "History", dateCreated: "" },
        incomingRelations: [],
        outgoingRelations: [],
      });
    });

    it("updates to one collection entry do not cause re-renders for users of other entries", async () => {
      const getArc1Reactive = jest.fn(() =>
        state.collection("arcs").getReactiveVar("1")
      );
      const getArc2Reactive = jest.fn(() =>
        state.collection("arcs").getReactiveVar("2")
      );

      const TestComponent1 = () => {
        const arc1 = useReactiveVar(getArc1Reactive());

        return (
          <>
            <div>{arc1?.name}</div>
          </>
        );
      };

      const TestComponent2 = () => {
        const arc2 = useReactiveVar(getArc2Reactive());

        return <div>{arc2?.name}</div>;
      };

      render(
        <>
          <TestComponent1 />
          <TestComponent2 />
        </>
      );

      act(() => {
        state.collection("arcs").set("1", { color: 1 });
      });

      expect(getArc1Reactive.mock.calls.length).toBe(2);
      expect(getArc2Reactive.mock.calls.length).toBe(1);
    });
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
