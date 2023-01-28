import React from "react";
import { render } from "@testing-library/react";
import {
  initialInMemoryState,
  InMemoryState,
} from "state/in-memory/in-memory-state";
import {
  createEditorState,
  createEditorStateFromFormat,
  moveEditorSelection,
  moveEditorSelectionFromFormat,
} from "util/__tests__/editor-utils";
import { parseContentState, stringifyContentState } from "util/content-state";
import { IpsumDateTime } from "util/dates";
import { DateTime } from "luxon";
import { APIDispatcher } from "./api-test-utils";
import { nextHue } from "util/colors";

describe.skip("Arc API", () => {
  describe("createAndAssignArc", () => {
    it("creates a single arc without an assignment if no entryKey or selectionState is provided", () => {
      const newStateFn = jest.fn();
      const { unmount } = render(
        <APIDispatcher
          beforeState={initialInMemoryState}
          calls={[
            () => ({
              name: "createAndAssignArc",
              actParams: { name: "new arc" },
            }),
          ]}
          onStateChange={newStateFn}
        />
      );

      const updatedState: InMemoryState = newStateFn.mock.calls[1][0];
      expect(Object.values(updatedState.arcs)[0].name).toEqual("new arc");

      unmount();
    });

    it("creates a single arc assignment on an entry and includes entities in editor content state", () => {
      const editorState = createEditorState("Hello World!", 0, 2);
      const newStateFn = jest.fn();
      const { unmount } = render(
        <APIDispatcher
          beforeState={initialInMemoryState}
          calls={[
            () => ({
              name: "createOrUpdateEntry",
              actParams: {
                entryKey: "entry_key",
                contentState: stringifyContentState(
                  editorState.getCurrentContent()
                ),
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

      const updatedState: InMemoryState = newStateFn.mock.calls[1][0];

      expect(Object.keys(updatedState.entries).length).toBe(1);
      expect(Object.keys(updatedState.arcAssignments).length).toBe(1);
      expect(Object.keys(updatedState.arcs).length).toBe(1);

      const arcId = Object.keys(updatedState.arcs)[0];

      expect(updatedState.arcs[arcId].name).toBe("new arc");
      expect(updatedState.arcs[arcId].id).toBe(arcId);

      const assignmentId = Object.keys(updatedState.arcAssignments)[0];
      expect(updatedState.arcAssignments[assignmentId].arcId).toBe(arcId);
      expect(updatedState.arcAssignments[assignmentId].entryKey).toBe(
        "entry_key"
      );

      const contentState = parseContentState(
        updatedState.entries["entry_key"].contentState
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
          beforeState={initialInMemoryState}
          calls={[
            () => ({
              name: "createOrUpdateEntry",
              actParams: {
                entryKey: "entry_key",
                contentState: stringifyContentState(
                  editorState1.getCurrentContent()
                ),
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

      const updatedState: InMemoryState = newStateFn.mock.calls[1][0];

      expect(Object.keys(updatedState.entries).length).toBe(1);
      expect(Object.keys(updatedState.arcAssignments).length).toBe(2);
      expect(Object.keys(updatedState.arcs).length).toBe(2);

      const arcId1 = Object.keys(updatedState.arcs)[0];
      const arcId2 = Object.keys(updatedState.arcs)[1];

      expect(updatedState.arcs[arcId1].name).toBe("new arc 1");
      expect(updatedState.arcs[arcId1].id).toBe(arcId1);

      expect(updatedState.arcs[arcId2].name).toBe("new arc 2");
      expect(updatedState.arcs[arcId2].id).toBe(arcId2);

      const assignmentId1 = Object.keys(updatedState.arcAssignments).find(
        (assignmentId) =>
          updatedState.arcAssignments[assignmentId].arcId === arcId1
      );
      expect(updatedState.arcAssignments[assignmentId1].arcId).toBe(arcId1);
      expect(updatedState.arcAssignments[assignmentId1].entryKey).toBe(
        "entry_key"
      );

      const assignmentId2 = Object.keys(updatedState.arcAssignments).find(
        (assignmentId) =>
          updatedState.arcAssignments[assignmentId].arcId === arcId2
      );
      expect(updatedState.arcAssignments[assignmentId2].arcId).toBe(arcId2);
      expect(updatedState.arcAssignments[assignmentId2].entryKey).toBe(
        "entry_key"
      );

      unmount();
    });

    it("advances hue in journal metadata", () => {
      const editorState = createEditorState("Hello World!", 0, 2);
      const newStateFn = jest.fn();
      const { unmount } = render(
        <APIDispatcher
          beforeState={initialInMemoryState}
          calls={[
            () => ({
              name: "createOrUpdateEntry",
              actParams: {
                entryKey: "entry_key",
                contentState: stringifyContentState(
                  editorState.getCurrentContent()
                ),
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
        nextHue(initialInMemoryState.journalMetadata.lastArcHue)
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
            ...initialInMemoryState,
            arcs: { arc_id: { id: "arc_id", name: "test arc", color: 0 } },
            entries: {
              entry_key: {
                date: new IpsumDateTime(DateTime.now()),
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

      const updatedState: InMemoryState = newStateFn.mock.calls[1][0];

      expect(Object.values(updatedState.arcAssignments).length).toEqual(1);
      expect(Object.values(updatedState.arcAssignments)[0].arcId).toEqual(
        "arc_id"
      );
      expect(Object.values(updatedState.arcAssignments)[0].entryKey).toEqual(
        "entry_key"
      );

      const contentState = parseContentState(
        updatedState.entries["entry_key"].contentState
      );
      expect(
        contentState
          .getAllEntities()
          .find(
            (entity) =>
              entity.getType() === "ARC" &&
              entity.getData().arcIds.includes("arc_id")
          )
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
            ...initialInMemoryState,
            arcs: { arc_id: { id: "arc_id", name: "test arc", color: 0 } },
            entries: {
              entry_key: {
                date: new IpsumDateTime(DateTime.now()),
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
          beforeState={initialInMemoryState}
          calls={[
            () => ({
              name: "createAndAssignArc",
              actParams: {
                name: "new arc",
              },
            }),
            (state) => {
              return {
                name: "updateArc",
                actParams: {
                  arcId: Object.keys(state.arcs)[0],
                  color: 200,
                },
              };
            },
          ]}
          onStateChange={newStateFn}
        />
      );

      expect(newStateFn.mock.calls.length).toBe(3);
      const updatedState: InMemoryState = newStateFn.mock.calls[2][0];
      expect(Object.values(updatedState.arcs)[0].color).toBe(200);

      unmount();
    });
  });
});
