import { SelectionState } from "draft-js";
import { parseContentState, stringifyContentState } from "util/content-state";
import { IpsumEntityTransformer } from "util/entities";
import { InMemoryState } from "./in-memory-state";

export type ArcAction =
  | {
      type: "CREATE-ARC";
      payload: Parameters<typeof arcDispatchers["CREATE-ARC"]>["1"];
    }
  | {
      type: "ASSIGN-ARC";
      payload: Parameters<typeof arcDispatchers["ASSIGN-ARC"]>["1"];
    }
  | {
      type: "UNASSIGN-ARC";
      payload: Parameters<typeof arcDispatchers["UNASSIGN-ARC"]>["1"];
    }
  | {
      type: "UPDATE-ARC";
      payload: Parameters<typeof arcDispatchers["UPDATE-ARC"]>["1"];
    };

export const arcDispatchers = {
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

    const contentStateWithAssignment = new IpsumEntityTransformer(
      parseContentState(entry.contentState)
    ).applyEntityData(payload.selectionState, "textArcAssignments", {
      arcId: payload.arcId,
      arcAssignmentId: payload.assignmentId,
    }).contentState;

    return {
      ...state,
      entries: {
        ...state.entries,
        [payload.entryKey]: {
          ...state.entries[payload.entryKey],
          contentState: stringifyContentState(contentStateWithAssignment),
        },
      },
    };
  },
  "UNASSIGN-ARC": (
    state: InMemoryState,
    payload: { arcId: string; entryKey: string }
  ): InMemoryState => {
    const entry = state.entries[payload.entryKey];

    const contentStateWithoutArc = new IpsumEntityTransformer(
      parseContentState(entry.contentState)
    ).removeEntityData("arcIds", payload.arcId).contentState;

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
