import { IpsumDateTime } from "util/dates";
import { InMemoryState } from "./in-memory-state";
import { Modifier, SelectionState } from "draft-js";
import { parseContentState, stringifyContentState } from "util/content-state";

export type InMemoryAction =
  | {
      type: "OVERRIDE";
      payload: Parameters<typeof dispatchers["OVERRIDE"]>["1"];
    }
  | {
      type: "CREATE-OR-UPDATE-ENTRY";
      payload: Parameters<typeof dispatchers["CREATE-OR-UPDATE-ENTRY"]>["1"];
    }
  | {
      type: "CREATE-ARC";
      payload: Parameters<typeof dispatchers["CREATE-ARC"]>["1"];
    }
  | {
      type: "ASSIGN-ARC";
      payload: Parameters<typeof dispatchers["ASSIGN-ARC"]>["1"];
    }
  | {
      type: "DELETE-ENTRY";
      payload: Parameters<typeof dispatchers["DELETE-ENTRY"]>["1"];
    };

export type InMemoryActionType = InMemoryAction["type"];

const dispatchers = {
  OVERRIDE: (state: InMemoryState, payload: { state: InMemoryState }) => {
    return payload.state;
  },
  "CREATE-OR-UPDATE-ENTRY": (
    state: InMemoryState,
    payload: { entryKey: string; date: IpsumDateTime; contentState: string }
  ): InMemoryState => {
    return {
      ...state,
      entries: {
        ...state.entries,
        [payload.entryKey]: {
          ...payload,
        },
      },
    };
  },
  "CREATE-ARC": (
    state: InMemoryState,
    payload: { id: string; name: string; color: number }
  ): InMemoryState => {
    if (payload.name === "") {
      throw new Error("Arc name cannot be empty");
    }
    return {
      ...state,
      arcs: {
        [payload.id]: {
          id: payload.id,
          name: payload.name,
          color: payload.color,
        },
      },
    };
  },
  "ASSIGN-ARC": (
    state: InMemoryState,
    payload: {
      assignmentId: string;
      arcId: string;
      entryKey: string;
      selectionState: SelectionState;
    }
  ): InMemoryState => {
    const entry = state.entries[payload.entryKey];
    const contentState = parseContentState(entry.contentState);
    const contentStateWithEntity = contentState.createEntity("ARC", "MUTABLE", {
      arcId: payload.arcId,
    });
    const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
    const contentStateWithArc = Modifier.applyEntity(
      contentStateWithEntity,
      payload.selectionState,
      entityKey
    );

    return {
      ...state,
      entries: {
        ...state.entries,
        [payload.entryKey]: {
          ...state.entries[payload.entryKey],
          contentState: stringifyContentState(contentStateWithArc),
        },
      },
      arcAssignments: {
        ...state.arcAssignments,
        [payload.assignmentId]: {
          id: payload.assignmentId,
          arcId: payload.arcId,
          entryKey: payload.entryKey,
        },
      },
    };
  },
  "DELETE-ENTRY": (
    state: InMemoryState,
    payload: { entryKey: string }
  ): InMemoryState => {
    const copy = { ...state };
    delete copy.entries[payload.entryKey];
    return copy;
  },
};

export const dispatch = (
  state: InMemoryState,
  action: InMemoryAction
): InMemoryState => {
  switch (action.type) {
    case "ASSIGN-ARC":
      return dispatchers[action.type](state, action.payload);
    case "CREATE-ARC":
      return dispatchers[action.type](state, action.payload);
    case "OVERRIDE":
      return dispatchers[action.type](state, action.payload);
    case "CREATE-OR-UPDATE-ENTRY":
      return dispatchers[action.type](state, action.payload);
    case "DELETE-ENTRY":
      return dispatchers[action.type](state, action.payload);
    default:
      return { ...state };
  }
};
