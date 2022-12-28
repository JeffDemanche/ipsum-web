import { parseContentState } from "util/content-state";
import { IpsumDateTime } from "util/dates";
import { IpsumEntityTransformer } from "util/entities";
import { InMemoryState } from "./in-memory-state";

export type EntryAction =
  | {
      type: "CREATE-OR-UPDATE-ENTRY";
      payload: Parameters<
        typeof entryDispatchers["CREATE-OR-UPDATE-ENTRY"]
      >["1"];
    }
  | {
      type: "DELETE-ENTRY";
      payload: Parameters<typeof entryDispatchers["DELETE-ENTRY"]>["1"];
    };

export const entryDispatchers = {
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
};
