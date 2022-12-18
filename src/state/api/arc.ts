import { SelectionState } from "draft-js";
import { APIContext } from "./use-api-action";
import { v4 as uuidv4 } from "uuid";
import { nextHue } from "util/colors";

export const apiCreateAndAssignArc = (
  {
    name,
    entryKey,
    selectionState,
  }: { name: string; entryKey?: string; selectionState?: SelectionState },
  context: APIContext
) => {
  if ((!entryKey && selectionState) || (entryKey && !selectionState)) {
    throw new Error(
      "createAndAssignArc: entryKey and selectionState must both or neither be provided"
    );
  }

  const arcId = uuidv4();
  const assignmentId = uuidv4();
  const color = nextHue(context.state.journalMetadata?.lastArcHue ?? 0);

  context.dispatch({
    type: "CREATE-ARC",
    payload: { id: arcId, name, color },
  });
  if (entryKey) {
    context.dispatch({
      type: "ASSIGN-ARC",
      payload: {
        assignmentId,
        arcId,
        entryKey,
        selectionState,
      },
    });
  }
  context.dispatch({
    type: "UPDATE-JOURNAL-METADATA",
    payload: { journalMetadata: { lastArcHue: color } },
  });
  if (entryKey) {
    context.reloadEditor();
  }
};

export const apiAssignArc = (
  {
    arcId,
    entryKey,
    selectionState,
  }: { arcId: string; entryKey: string; selectionState: SelectionState },
  context: APIContext
) => {
  if (!Object.keys(context.state.arcs).includes(arcId))
    throw new Error("assignArc: arc not found");

  if (!Object.keys(context.state.entries).includes(entryKey))
    throw new Error("assignArc: entry not found");

  const assignmentId = uuidv4();

  context.dispatch({
    type: "ASSIGN-ARC",
    payload: {
      assignmentId,
      arcId,
      entryKey,
      selectionState,
    },
  });
  context.reloadEditor();
};

export const apiUnassignArc = (
  { arcId, entryKey }: { arcId: string; entryKey: string },
  context: APIContext
) => {
  if (!Object.keys(context.state.arcs).includes(arcId))
    throw new Error("unassignArc: arc not found");

  if (!Object.keys(context.state.entries).includes(entryKey))
    throw new Error("unassignArc: entry not found");

  context.dispatch({ type: "UNASSIGN-ARC", payload: { arcId, entryKey } });
  context.reloadEditor();
};

export const apiUpdateArc = (
  { arcId, color }: { arcId: string; color?: number },
  context: APIContext
) => {
  if (!Object.keys(context.state.arcs).includes(arcId))
    throw new Error("updateArc: arc not found");

  context.dispatch({ type: "UPDATE-ARC", payload: { arcId, color } });
};
