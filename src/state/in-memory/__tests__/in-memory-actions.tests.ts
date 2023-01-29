import { IpsumDateTime } from "util/dates";
import { dispatch, InMemoryAction } from "../in-memory-actions";
import { InMemoryCollections, InMemoryState } from "../in-memory-schema";
import {
  initializeDefaultDocument,
  initializeDefaultInMemoryState,
} from "../in-memory-state";

const reducer = (
  state: InMemoryState,
  action: InMemoryAction
): InMemoryState => {
  return dispatch(state, action);
};

describe("InMemoryState Reducer", () => {
  describe("CREATE_DOCUMENT", () => {
    it("creates a default entry when provided document arg is empty", () => {
      const defaultState = initializeDefaultInMemoryState();
      const afterState = reducer(defaultState, {
        type: "CREATE_DOCUMENT",
        payload: { type: "entry", document: {} },
      });
      expect(Object.keys(afterState.entry)).toHaveLength(1);
      expect(Object.values(afterState.entry)[0].entryKey).toEqual(
        InMemoryCollections.entry.fields.entryKey.default()
      );
    });

    it("creates a default entry with overwritten properties when document arg is partial", () => {
      const defaultState = initializeDefaultInMemoryState();
      const date = IpsumDateTime.fromString(
        "12/29/2022",
        "entry-printed-date"
      ).dateTime.toISO();
      const afterState = reducer(defaultState, {
        type: "CREATE_DOCUMENT",
        payload: {
          type: "entry",
          document: {
            entryKey: "12/29/2022",
            date,
          },
        },
      });
      expect(Object.keys(afterState.entry)).toHaveLength(1);
      expect(Object.values(afterState.entry)[0].entryKey).toEqual("12/29/2022");
      expect(Object.values(afterState.entry)[0].date).toEqual(date);
    });
  });

  describe("UPDATE_DOCUMENT", () => {
    it("updates an existing arc with new color", () => {
      const arc = initializeDefaultDocument("arc");
      const defaultState: InMemoryState = {
        ...initializeDefaultInMemoryState(),
        arc: { [arc.id]: arc },
      };
      const afterState = reducer(defaultState, {
        type: "UPDATE_DOCUMENT",
        payload: { type: "arc", key: arc.id, update: { color: 124 } },
      });
      expect(Object.values(afterState.arc)).toHaveLength(1);
      expect(Object.values(afterState.arc)[0].color).toEqual(124);
      expect(Object.values(afterState.arc)[0].name).toEqual(
        InMemoryCollections.arc.fields.name.default()
      );
    });

    it("prevents updating primary key on an entry", () => {
      const entry = initializeDefaultDocument("entry");
      const defaultState: InMemoryState = {
        ...initializeDefaultInMemoryState(),
        entry: { [entry.entryKey]: entry },
      };
      expect(() => {
        reducer(defaultState, {
          type: "UPDATE_DOCUMENT",
          payload: {
            type: "entry",
            key: entry.entryKey,
            update: { entryKey: "test" },
          },
        });
      }).toThrowError(
        new Error(
          "UPDATE_DOCUMENT: can't set primary key value in document update for entry"
        )
      );
    });
  });

  describe("REMOVE_DOCUMENT", () => {
    it("removes an arc assignment by id", () => {
      const arcAssignment = initializeDefaultDocument("arc_assignment");
      const defaultState: InMemoryState = {
        ...initializeDefaultInMemoryState(),
        arc_assignment: {
          [arcAssignment.id]: arcAssignment,
        },
      };
      const afterState = reducer(defaultState, {
        type: "REMOVE_DOCUMENT",
        payload: { type: "arc_assignment", key: arcAssignment.id },
      });
      expect(Object.entries(afterState.arc_assignment)).toHaveLength(0);
    });
  });
});
