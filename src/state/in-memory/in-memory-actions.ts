import { InMemoryState } from "./in-memory-state";
import { EntryAction, entryDispatchers } from "./entry-actions";
import { ArcAction, arcDispatchers } from "./arc-actions";
import { JournalAction, journalDispatchers } from "./journal-actions";
import {
  ArcAssignmentAction,
  arcAssignmentDispatchers,
} from "./arc-assignment-actions";

export type InMemoryAction =
  | EntryAction
  | ArcAction
  | JournalAction
  | ArcAssignmentAction
  | {
      type: "OVERRIDE";
      payload: Parameters<typeof dispatchers["OVERRIDE"]>["1"];
    };

export type InMemoryActionType = InMemoryAction["type"];

const dispatchers = {
  ...entryDispatchers,
  ...arcDispatchers,
  ...journalDispatchers,
  ...arcAssignmentDispatchers,
  OVERRIDE: (state: InMemoryState, payload: { state: InMemoryState }) => {
    return payload.state;
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
    case "UPDATE-JOURNAL-TITLE":
      return dispatchers[action.type](state, action.payload);
    case "UNASSIGN-ARC":
      return dispatchers[action.type](state, action.payload);
    case "UPDATE-ARC":
      return dispatchers[action.type](state, action.payload);
    case "CREATE-ARC-ASSIGNMENT":
      return dispatchers[action.type](state, action.payload);
    default:
      return { ...state };
  }
};
