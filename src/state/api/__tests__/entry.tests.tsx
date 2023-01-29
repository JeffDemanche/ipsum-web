import React from "react";
import { render } from "@testing-library/react";
import { initializeDefaultInMemoryState } from "state/in-memory/in-memory-state";
import { IpsumDateTime } from "util/dates";
import {
  createEditorState,
  moveEditorSelection,
} from "util/__tests__/editor-utils";
import { APIDispatcher } from "./api-test-utils";
import { InMemoryState } from "state/in-memory/in-memory-schema";
import { IpsumEntityTransformer } from "util/entities";
import { DateTime } from "luxon";
import { parseContentState, stringifyContentState } from "util/content-state";

describe("Entry API", () => {
  describe("createOrUpdateEntry", () => {
    it("creates an empty entry for a date", () => {
      const editorState = createEditorState("Hello World!", 0, 0);
      const newStateFn = jest.fn();
      const date = IpsumDateTime.fromString("8/9/1998", "entry-printed-date");
      const { unmount } = render(
        <APIDispatcher
          beforeState={initializeDefaultInMemoryState()}
          calls={[
            () => {
              return {
                name: "createOrUpdateEntry",
                actParams: {
                  entryKey: "8/9/1998",
                  date,
                  contentState: editorState.getCurrentContent(),
                },
              };
            },
          ]}
          onStateChange={newStateFn}
        ></APIDispatcher>
      );

      const updatedState: InMemoryState = newStateFn.mock.calls[1][0];

      expect(Object.values(updatedState.entry).length).toEqual(1);
      expect(Object.values(updatedState.entry)[0].entryKey).toEqual("8/9/1998");
      expect(Object.values(updatedState.entry)[0].date).toEqual(
        date.dateTime.toISO()
      );
      expect(
        parseContentState(
          Object.values(updatedState.entry)[0].contentState
        ).getPlainText()
      ).toEqual("Hello World!");

      unmount();
    });

    it("updates where an arc has been removed from the contentState delete related arc assignments", () => {
      const editorStateSelHello = createEditorState("Hello World!", 0, 5);
      const editorStateSelWorld = moveEditorSelection({
        editorState: editorStateSelHello,
        anchorOffset: 6,
        focusOffset: 11,
      });
      const contentStateWithHello = new IpsumEntityTransformer(
        editorStateSelHello.getCurrentContent()
      ).applyEntityData(
        editorStateSelHello.getSelection(),
        "textArcAssignments",
        { arcAssignmentId: "assgn_hello", arcId: "arc_hello" }
      ).contentState;

      const contentStateWithHelloWorld = new IpsumEntityTransformer(
        contentStateWithHello
      ).applyEntityData(
        editorStateSelWorld.getSelection(),
        "textArcAssignments",
        { arcAssignmentId: "assgn_world", arcId: "arc_world" }
      ).contentState;

      const newStateFn = jest.fn();
      const date = IpsumDateTime.fromString("8/9/1998", "entry-printed-date");
      const { unmount } = render(
        <APIDispatcher
          beforeState={{
            ...initializeDefaultInMemoryState(),
            arc: {
              arc_hello: {
                color: 0,
                id: "arc_hello",
                name: "hello",
              },
              arc_world: {
                color: 127,
                id: "arc_world",
                name: "world",
              },
            },
            entry: {
              entry_key_1: {
                contentState: stringifyContentState(contentStateWithHelloWorld),
                date: new IpsumDateTime(DateTime.now()).dateTime.toISO(),
                entryKey: "entry_key_1",
              },
            },
            arc_assignment: {
              assgn_hello: {
                id: "assgn_hello",
                arcId: "arc_hello",
                entryKey: "entry_key_1",
              },
              assgn_world: {
                id: "assgn_world",
                arcId: "arc_world",
                entryKey: "entry_key_1",
              },
            },
          }}
          calls={[
            () => {
              return {
                name: "createOrUpdateEntry",
                actParams: {
                  entryKey: "entry_key_1",
                  date,
                  contentState: contentStateWithHello,
                },
              };
            },
          ]}
          onStateChange={newStateFn}
        ></APIDispatcher>
      );

      const updatedState: InMemoryState =
        newStateFn.mock.calls[newStateFn.mock.calls.length - 1][0];

      expect(Object.values(updatedState.arc_assignment).length).toEqual(1);
      expect(Object.values(updatedState.arc_assignment)[0].arcId).toEqual(
        "arc_hello"
      );

      unmount();
    });
  });

  describe("deleteEntry", () => {
    it("removes the entry with given entryKey", () => {
      const editorState = createEditorState("Hello World!", 0, 2);
      const newStateFn = jest.fn();
      const { unmount } = render(
        <APIDispatcher
          beforeState={{
            ...initializeDefaultInMemoryState(),
            entry: {
              entry_key_1: {
                entryKey: "entry_key_1",
                contentState: stringifyContentState(
                  editorState.getCurrentContent()
                ),
                date: new IpsumDateTime(DateTime.now()).dateTime.toISO(),
              },
            },
          }}
          calls={[
            (state) => {
              return {
                name: "deleteEntry",
                actParams: {
                  entryKey: "entry_key_1",
                },
              };
            },
          ]}
          onStateChange={newStateFn}
        ></APIDispatcher>
      );

      const updatedState: InMemoryState = newStateFn.mock.calls[1][0];

      expect(Object.values(updatedState.entry).length).toEqual(0);

      unmount();
    });

    it("removes any arc assignments with given entryKey", () => {
      const editorState = createEditorState("Hello World!", 0, 2);
      const newStateFn = jest.fn();
      const { unmount } = render(
        <APIDispatcher
          beforeState={{
            ...initializeDefaultInMemoryState(),
            entry: {
              entry_key_1: {
                entryKey: "entry_key_1",
                contentState: stringifyContentState(
                  editorState.getCurrentContent()
                ),
                date: new IpsumDateTime(DateTime.now()).dateTime.toISO(),
              },
            },
            arc: {
              arc_1: {
                color: 0,
                id: "arc_1",
                name: "arc one",
              },
            },
            arc_assignment: {
              assgn_1: {
                id: "assgn_1",
                entryKey: "entry_key_1",
                arcId: "arc_1",
              },
              assgn_2: {
                id: "assgn_2",
                entryKey: "another_entry",
                arcId: "arc_1",
              },
            },
          }}
          calls={[
            (state) => {
              return {
                name: "deleteEntry",
                actParams: {
                  entryKey: "entry_key_1",
                },
              };
            },
          ]}
          onStateChange={newStateFn}
        ></APIDispatcher>
      );

      const updatedState: InMemoryState = newStateFn.mock.calls[1][0];

      expect(Object.values(updatedState.arc_assignment).length).toEqual(1);
      expect(Object.values(updatedState.arc_assignment)[0].entryKey).toEqual(
        "another_entry"
      );

      unmount();
    });
  });
});
