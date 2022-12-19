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
    }
  | {
      type: "UPDATE-JOURNAL-TITLE";
      payload: Parameters<typeof dispatchers["UPDATE-JOURNAL-TITLE"]>["1"];
    }
  | {
      type: "UNASSIGN-ARC";
      payload: Parameters<typeof dispatchers["UNASSIGN-ARC"]>["1"];
    }
  | {
      type: "UPDATE-ARC";
      payload: Parameters<typeof dispatchers["UPDATE-ARC"]>["1"];
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
    const arcsInContent = new IpsumEntityTransformer(
      parseContentState(payload.contentState)
    ).getAppliedArcs();

    // We should handle parsing assignments from the content state at the API level.
    const arcAssignmentsToDelete = Object.values(state.arcAssignments).filter(
      (assgn) =>
        assgn.entryKey === payload.entryKey &&
        !arcsInContent.includes(assgn.arcId)
    );

    const newArcAssignments = { ...state.arcAssignments };
    arcAssignmentsToDelete.forEach((assgn) => {
      delete newArcAssignments[assgn.id];
    });

    return {
      ...state,
      entries: {
        ...state.entries,
        [payload.entryKey]: {
          ...payload,
        },
      },
      arcAssignments: newArcAssignments,
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

    const assignmentAlreadyExists = !!Object.values(state.arcAssignments).find(
      (assignment) =>
        assignment.arcId === payload.arcId &&
        assignment.entryKey === payload.entryKey
    );

    const arcAssignments = assignmentAlreadyExists
      ? state.arcAssignments
      : {
          ...state.arcAssignments,
          [payload.assignmentId]: {
            id: payload.assignmentId,
            arcId: payload.arcId,
            entryKey: payload.entryKey,
          },
        };

    return {
      ...state,
      entries: {
        ...state.entries,
        [payload.entryKey]: {
          ...state.entries[payload.entryKey],
          contentState: stringifyContentState(contentStateWithArc),
        },
      },
      arcAssignments,
    };
  },
  "DELETE-ENTRY": (
    state: InMemoryState,
    payload: { entryKey: string }
  ): InMemoryState => {
    const copy = { ...state };
    delete copy.entries[payload.entryKey];
    const arcAssignmentsCopy = { ...state.arcAssignments };
    Object.keys(state.arcAssignments).forEach((arcAssignment) => {
      if (arcAssignmentsCopy[arcAssignment].entryKey === payload.entryKey) {
        delete arcAssignmentsCopy[arcAssignment];
      }
    });
    copy.arcAssignments = arcAssignmentsCopy;
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
  "UPDATE-JOURNAL-TITLE": (
    state: InMemoryState,
    payload: { title: string }
  ): InMemoryState => {
    return { ...state, journalTitle: payload.title };
  },
  "UNASSIGN-ARC": (
    state: InMemoryState,
    payload: { arcId: string; entryKey: string }
  ): InMemoryState => {
    const entry = state.entries[payload.entryKey];

    const contentStateWithoutArc = new IpsumEntityTransformer(
      parseContentState(entry.contentState)
    ).removeArc(payload.arcId).contentState;

    const copy = { ...state };
    const assignment = Object.values(copy.arcAssignments).find(
      (assgn) =>
        assgn.arcId === payload.arcId && assgn.entryKey === payload.entryKey
    );
    copy.entries[payload.entryKey].contentState = stringifyContentState(
      contentStateWithoutArc
    );
    if (assignment) {
      delete copy.arcAssignments[assignment.id];
    }
    return copy;
  },
  "UPDATE-ARC": (
    state: InMemoryState,
    payload: { arcId: string } & Partial<{ color: number }>
  ): InMemoryState => {
    const arcCopy = { ...state.arcs[payload.arcId], ...payload };

    if (!arcCopy) throw new Error("Arc ID to update could not be found");

    const stateCopy = { ...state };

    stateCopy.arcs[arcCopy.id] = arcCopy;

    return stateCopy;
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
    default:
      return { ...state };
  }
};
