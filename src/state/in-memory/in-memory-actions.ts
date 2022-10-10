import { IpsumDateTime } from "util/dates";
import { InMemoryJournalMetadata, InMemoryState } from "./in-memory-state";
import { SelectionState } from "draft-js";
import { parseContentState, stringifyContentState } from "util/content-state";
import { IpsumEntityTransformer } from "util/entities";

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
    }
  | {
      type: "UPDATE-JOURNAL-METADATA";
      payload: Parameters<typeof dispatchers["UPDATE-JOURNAL-METADATA"]>["1"];
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
        ...state.arcs,
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

    const contentStateWithArc = new IpsumEntityTransformer(
      parseContentState(entry.contentState)
    ).applyArc(payload.selectionState, payload.arcId).contentState;

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
  "UPDATE-JOURNAL-METADATA": (
    state: InMemoryState,
    payload: { journalMetadata: Partial<InMemoryJournalMetadata> }
  ): InMemoryState => {
    const copy = { ...state };
    copy.journalMetadata = {
      ...copy.journalMetadata,
      ...payload.journalMetadata,
    };
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
    case "UPDATE-JOURNAL-METADATA":
      return dispatchers[action.type](state, action.payload);
    default:
      return { ...state };
  }
};
