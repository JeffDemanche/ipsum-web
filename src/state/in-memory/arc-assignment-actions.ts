import { InMemoryState } from "./in-memory-state";

export type ArcAssignmentAction = {
  type: "CREATE-ARC-ASSIGNMENT";
  payload: Parameters<
    typeof arcAssignmentDispatchers["CREATE-ARC-ASSIGNMENT"]
  >["1"];
};

export const arcAssignmentDispatchers = {
  "CREATE-ARC-ASSIGNMENT": (
    state: InMemoryState,
    payload: { id: string; entryKey: string; arcId: string }
  ): InMemoryState => {
    if (!Object.keys(state.entries).includes(payload.entryKey))
      throw new Error("entryKey for arcAssignment wasn't found");
    if (!Object.keys(state.arcs).includes(payload.arcId))
      throw new Error("arcId for arcAssignment wasn't found");
    if (
      Object.values(state.arcAssignments).find(
        (a) => a.arcId === payload.arcId && a.entryKey === payload.entryKey
      )
    )
      throw new Error(`Tried to create duplicate arcAssignment for arcId ${payload.arcId} and entryKey ${payload.entryKey}
    `);

    const copy = { ...state };
    copy.arcAssignments[payload.id] = payload;
    return copy;
  },
};
