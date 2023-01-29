import React from "react";
import { render } from "@testing-library/react";
import { APIDispatcher } from "./api-test-utils";
import { initializeDefaultInMemoryState } from "state/in-memory/in-memory-state";
import { InMemoryState } from "state/in-memory/in-memory-schema";
import {
  createEditorState,
  createEditorStateFromFormat,
  moveEditorSelection,
  moveEditorSelectionFromFormat,
} from "util/__tests__/editor-utils";
import { IpsumDateTime } from "util/dates";
import { DateTime } from "luxon";
import { nextHue } from "util/colors";
import { parseContentState, stringifyContentState } from "util/content-state";

describe("Arc API", () => {
  describe("createAndAssignArc", () => {
    it("creates a single arc without an assignment if no entryKey or selectionState is provided", () => {
      const newStateFn = jest.fn();
      const state = initializeDefaultInMemoryState();
      const { unmount } = render(
        <APIDispatcher
          beforeState={state}
          calls={[
            () => ({
              name: "createAndAssignArc",
              actParams: { name: "new arc" },
            }),
          ]}
          onStateChange={newStateFn}
        />
      );

      const updatedState: InMemoryState =
        newStateFn.mock.calls[newStateFn.mock.calls.length - 1][0];
      expect(Object.values(updatedState.arc)[0].name).toEqual("new arc");

      unmount();
    });

    it("creates a single arc assignment on an entry and includes entities in editor content state", () => {
      const editorState = createEditorState("Hello World!", 0, 2);
      const newStateFn = jest.fn();
      const { unmount } = render(
        <APIDispatcher
          beforeState={initializeDefaultInMemoryState()}
          calls={[
            () => ({
              name: "createOrUpdateEntry",
              actParams: {
                entryKey: "entry_key",
                contentState: editorState.getCurrentContent(),
                date: new IpsumDateTime(DateTime.now()),
              },
            }),
            () => ({
              name: "createAndAssignArc",
              actParams: {
                name: "new arc",
                entryKey: "entry_key",
                selectionState: editorState.getSelection(),
              },
            }),
          ]}
          onStateChange={newStateFn}
        />
      );

      const updatedState: InMemoryState =
        newStateFn.mock.calls[newStateFn.mock.calls.length - 1][0];

      expect(Object.keys(updatedState.entry).length).toBe(1);
      expect(Object.keys(updatedState.arc_assignment).length).toBe(1);
      expect(Object.keys(updatedState.arc).length).toBe(1);

      const arcId = Object.keys(updatedState.arc)[0];

      expect(updatedState.arc[arcId].name).toBe("new arc");
      expect(updatedState.arc[arcId].id).toBe(arcId);

      const assignmentId = Object.keys(updatedState.arc_assignment)[0];
      expect(updatedState.arc_assignment[assignmentId].arcId).toBe(arcId);
      expect(updatedState.arc_assignment[assignmentId].entryKey).toBe(
        "entry_key"
      );

      const contentState = parseContentState(
        updatedState.entry["entry_key"].contentState
      );
      expect(contentState.getAllEntities().size).toBe(2);

      unmount();
    });

    it("creates two arcs on the same entry", () => {
      const editorState1 = createEditorState("Hello World!", 6, 11);
      const editorState2 = moveEditorSelection({
        editorState: editorState1,
        anchorOffset: 0,
        focusOffset: 5,
      });
      const newStateFn = jest.fn();
      const { unmount } = render(
        <APIDispatcher
          beforeState={initializeDefaultInMemoryState()}
          calls={[
            () => ({
              name: "createOrUpdateEntry",
              actParams: {
                entryKey: "entry_key",
                contentState: editorState1.getCurrentContent(),
                date: new IpsumDateTime(DateTime.now()),
              },
            }),
            () => ({
              name: "createAndAssignArc",
              actParams: {
                name: "new arc 1",
                entryKey: "entry_key",
                selectionState: editorState1.getSelection(),
              },
            }),
            () => ({
              name: "createAndAssignArc",
              actParams: {
                name: "new arc 2",
                entryKey: "entry_key",
                selectionState: editorState2.getSelection(),
              },
            }),
          ]}
          onStateChange={newStateFn}
        />
      );

      const updatedState: InMemoryState =
        newStateFn.mock.calls[newStateFn.mock.calls.length - 1][0];

      expect(Object.keys(updatedState.entry).length).toBe(1);
      expect(Object.keys(updatedState.arc_assignment).length).toBe(2);
      expect(Object.keys(updatedState.arc).length).toBe(2);

      const arcId1 = Object.keys(updatedState.arc)[0];
      const arcId2 = Object.keys(updatedState.arc)[1];

      expect(updatedState.arc[arcId1].name).toBe("new arc 1");
      expect(updatedState.arc[arcId1].id).toBe(arcId1);

      expect(updatedState.arc[arcId2].name).toBe("new arc 2");
      expect(updatedState.arc[arcId2].id).toBe(arcId2);

      const assignmentId1 = Object.keys(updatedState.arc_assignment).find(
        (assignmentId) =>
          updatedState.arc_assignment[assignmentId].arcId === arcId1
      );
      expect(updatedState.arc_assignment[assignmentId1].arcId).toBe(arcId1);
      expect(updatedState.arc_assignment[assignmentId1].entryKey).toBe(
        "entry_key"
      );

      const assignmentId2 = Object.keys(updatedState.arc_assignment).find(
        (assignmentId) =>
          updatedState.arc_assignment[assignmentId].arcId === arcId2
      );
      expect(updatedState.arc_assignment[assignmentId2].arcId).toBe(arcId2);
      expect(updatedState.arc_assignment[assignmentId2].entryKey).toBe(
        "entry_key"
      );

      unmount();
    });

    it("advances hue in journal metadata", () => {
      const initialState = initializeDefaultInMemoryState();
      const editorState = createEditorState("Hello World!", 0, 2);
      const newStateFn = jest.fn();
      const { unmount } = render(
        <APIDispatcher
          beforeState={initialState}
          calls={[
            () => ({
              name: "createOrUpdateEntry",
              actParams: {
                entryKey: "entry_key",
                contentState: editorState.getCurrentContent(),
                date: new IpsumDateTime(DateTime.now()),
              },
            }),
            () => ({
              name: "createAndAssignArc",
              actParams: {
                name: "new arc",
                entryKey: "entry_key",
                selectionState: editorState.getSelection(),
              },
            }),
          ]}
          onStateChange={newStateFn}
        />
      );

      const lastState: InMemoryState =
        newStateFn.mock.calls[newStateFn.mock.calls.length - 1][0];

      expect(lastState.journalMetadata.lastArcHue).toEqual(
        nextHue(initialState.journalMetadata.lastArcHue)
      );

      unmount();
    });
  });

  describe("assignArc", () => {
    it("creates an arc assignment for an existing arc being assigned", () => {
      const newStateFn = jest.fn();

      const editorState = createEditorStateFromFormat("<p>hello world<p>");

      const { unmount } = render(
        <APIDispatcher
          beforeState={{
            ...initializeDefaultInMemoryState(),
            arc: { arc_id: { id: "arc_id", name: "test arc", color: 0 } },
            entry: {
              entry_key: {
                date: new IpsumDateTime(DateTime.now()).dateTime.toISO(),
                entryKey: "entry_key",
                contentState: stringifyContentState(
                  editorState.getCurrentContent()
                ),
              },
            },
          }}
          calls={[
            () => ({
              name: "assignArc",
              actParams: {
                arcId: "arc_id",
                entryKey: "entry_key",
                selectionState: moveEditorSelectionFromFormat(
                  editorState,
                  "<p>hello [world]<p>"
                ).getSelection(),
              },
            }),
          ]}
          onStateChange={newStateFn}
        />
      );

      const updatedState: InMemoryState =
        newStateFn.mock.calls[newStateFn.mock.calls.length - 1][0];

      expect(Object.values(updatedState.arc_assignment).length).toEqual(1);
      expect(Object.values(updatedState.arc_assignment)[0].arcId).toEqual(
        "arc_id"
      );
      expect(Object.values(updatedState.arc_assignment)[0].entryKey).toEqual(
        "entry_key"
      );

      const contentState = parseContentState(
        updatedState.entry["entry_key"].contentState
      );
      expect(
        contentState.getAllEntities().find((entity) => {
          return (
            entity.getType() === "ARC" &&
            entity
              .getData()
              .textArcAssignments.find(
                (a: { arcId: string }) => a.arcId === "arc_id"
              )
          );
        })
      ).toBeDefined();

      unmount();
    });

    it("throws an error if the arc is not found", () => {
      const newStateFn = jest.fn();

      const editorState = createEditorStateFromFormat("<p>hello world<p>");

      global.console.error = jest.fn();
      render(
        <APIDispatcher
          beforeState={{
            ...initializeDefaultInMemoryState(),
            arc: { arc_id: { id: "arc_id", name: "test arc", color: 0 } },
            entry: {
              entry_key: {
                date: new IpsumDateTime(DateTime.now()).dateTime.toISO(),
                entryKey: "entry_key",
                contentState: stringifyContentState(
                  editorState.getCurrentContent()
                ),
              },
            },
          }}
          calls={[
            () => ({
              name: "assignArc",
              actParams: {
                arcId: "wrong_arc_id",
                entryKey: "entry_key",
                selectionState: moveEditorSelectionFromFormat(
                  editorState,
                  "<p>hello [world]<p>"
                ).getSelection(),
              },
            }),
          ]}
          onStateChange={newStateFn}
        />
      );
      expect(global.console.error).toHaveBeenCalledWith(
        new Error("assignArc: arc not found")
      );
    });
  });

  describe("updateArc", () => {
    it("can update an arc's color", () => {
      const newStateFn = jest.fn();
      const { unmount } = render(
        <APIDispatcher
          beforeState={initializeDefaultInMemoryState()}
          calls={[
            () => {
              return {
                name: "createAndAssignArc",
                actParams: {
                  name: "new arc",
                },
              };
            },
            (state) => {
              return {
                name: "updateArc",
                actParams: {
                  arcId: Object.keys(state.arc)[0],
                  color: 200,
                },
              };
            },
          ]}
          onStateChange={newStateFn}
        />
      );

      expect(newStateFn.mock.calls.length).toBe(3);
      const updatedState: InMemoryState =
        newStateFn.mock.calls[newStateFn.mock.calls.length - 1][0];
      expect(Object.values(updatedState.arc)[0].color).toBe(200);

      unmount();
    });
  });
});
