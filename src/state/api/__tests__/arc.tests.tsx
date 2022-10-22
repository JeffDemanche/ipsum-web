import React from "react";
import { render } from "@testing-library/react";
import {
  initialInMemoryState,
  InMemoryState,
} from "state/in-memory/in-memory-state";
import { apiAssignArc, apiCreateAndAssignArc } from "../arc";
import {
  createEditorState,
  createEditorStateFromFormat,
  moveEditorSelection,
  moveEditorSelectionFromFormat,
} from "util/__tests__/editor-utils";
import { apiCreateOrUpdateEntry } from "../entry";
import { parseContentState, stringifyContentState } from "util/content-state";
import { IpsumDateTime } from "util/dates";
import { DateTime } from "luxon";
import { APIDispatcher } from "./api-test-utils";
import { nextHue } from "util/colors";

describe("Arc API", () => {
  describe("createAndAssignArc", () => {
    it("creates a single arc assignment on an entry and includes entities in editor content state", () => {
      const newStateFn = jest.fn();
      const { unmount } = render(
        <APIDispatcher
          beforeState={initialInMemoryState}
          action={(context) => {
            const editorState = createEditorState("Hello World!", 0, 2);

            apiCreateOrUpdateEntry(
              {
                entryKey: "entry_key",
                contentState: stringifyContentState(
                  editorState.getCurrentContent()
                ),
                date: new IpsumDateTime(DateTime.now()),
              },
              context
            );

            apiCreateAndAssignArc(
              {
                name: "new arc",
                entryKey: "entry_key",
                selectionState: editorState.getSelection(),
              },
              context
            );
          }}
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
      const newStateFn = jest.fn();
      const { unmount } = render(
        <APIDispatcher
          beforeState={initialInMemoryState}
          action={(context) => {
            const editorState1 = createEditorState("Hello World!", 6, 11);

            apiCreateOrUpdateEntry(
              {
                entryKey: "entry_key",
                contentState: stringifyContentState(
                  editorState1.getCurrentContent()
                ),
                date: new IpsumDateTime(DateTime.now()),
              },
              context
            );

            apiCreateAndAssignArc(
              {
                name: "new arc 1",
                entryKey: "entry_key",
                selectionState: editorState1.getSelection(),
              },
              context
            );

            const editorState2 = moveEditorSelection({
              editorState: editorState1,
              anchorOffset: 0,
              focusOffset: 5,
            });

            apiCreateAndAssignArc(
              {
                name: "new arc 2",
                entryKey: "entry_key",
                selectionState: editorState2.getSelection(),
              },
              context
            );
          }}
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
      const newStateFn = jest.fn();
      const { unmount } = render(
        <APIDispatcher
          beforeState={initialInMemoryState}
          action={(context) => {
            const editorState = createEditorState("Hello World!", 0, 2);

            apiCreateOrUpdateEntry(
              {
                entryKey: "entry_key",
                contentState: stringifyContentState(
                  editorState.getCurrentContent()
                ),
                date: new IpsumDateTime(DateTime.now()),
              },
              context
            );

            apiCreateAndAssignArc(
              {
                name: "new arc",
                entryKey: "entry_key",
                selectionState: editorState.getSelection(),
              },
              context
            );
          }}
          onStateChange={newStateFn}
        />
      );

      const updatedState: InMemoryState = newStateFn.mock.calls[1][0];
      expect(updatedState.journalMetadata.lastArcHue).toEqual(
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
          action={(context) => {
            apiAssignArc(
              {
                arcId: "arc_id",
                entryKey: "entry_key",
                selectionState: moveEditorSelectionFromFormat(
                  editorState,
                  "<p>hello [world]<p>"
                ).getSelection(),
              },
              context
            );
          }}
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
      expect(() =>
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
            action={(context) => {
              apiAssignArc(
                {
                  arcId: "wrong_arc_id",
                  entryKey: "entry_key",
                  selectionState: moveEditorSelectionFromFormat(
                    editorState,
                    "<p>hello [world]<p>"
                  ).getSelection(),
                },
                context
              );
            }}
            onStateChange={newStateFn}
          />
        )
      ).toThrow();
    });
  });
});
