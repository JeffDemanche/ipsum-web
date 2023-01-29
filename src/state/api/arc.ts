import { SelectionState } from "draft-js";
import { APIContext, APIReturn } from "./use-api-action";
import { v4 as uuidv4 } from "uuid";
import { nextHue } from "util/colors";
import { IpsumEntityTransformer } from "util/entities";
import { parseContentState, stringifyContentState } from "util/content-state";

export const apiCreateAndAssignArc = (
  {
    name,
    entryKey,
    selectionState,
  }: { name: string; entryKey?: string; selectionState?: SelectionState },
  context: APIContext
): APIReturn => {
  if ((!entryKey && selectionState) || (entryKey && !selectionState)) {
    throw new Error(
      "createAndAssignArc: entryKey and selectionState must both or neither be provided"
    );
  }

  const arcId = uuidv4();
  const color = nextHue(context.state.journalMetadata?.lastArcHue ?? 0);

  context = context.optimisticStateDispatch(context.state, {
    type: "CREATE_DOCUMENT",
    payload: { type: "arc", document: { id: arcId, name, color } },
  });

  if (entryKey) {
    context.state = apiAssignArc(
      { arcId, entryKey, selectionState },
      context
    ).state;
  }

  context = context.optimisticStateDispatch(context.state, {
    type: "UPDATE_FIELD",
    payload: { field: "journalMetadata", update: { lastArcHue: color } },
  });
  if (entryKey) {
    context.reloadEditor();
  }

  return { state: context.state };
};

export const apiAssignArc = (
  {
    arcId,
    entryKey,
    selectionState,
  }: { arcId: string; entryKey: string; selectionState: SelectionState },
  context: APIContext
): APIReturn => {
  if (!Object.keys(context.state.arc).includes(arcId))
    throw new Error("assignArc: arc not found");

  if (!Object.keys(context.state.entry).includes(entryKey))
    throw new Error("assignArc: entry not found");

  const assignmentId = uuidv4();

  const existingArcAssignment = Object.values(
    context.state.arc_assignment
  ).find((a) => a.arcId === arcId && a.entryKey === entryKey);

  const contentStateWithAssignment = new IpsumEntityTransformer(
    parseContentState(context.state.entry[entryKey].contentState)
  ).applyEntityData(selectionState, "textArcAssignments", {
    arcId,
    arcAssignmentId: assignmentId,
  }).contentState;

  if (!existingArcAssignment) {
    context = context.optimisticStateDispatch(context.state, {
      type: "CREATE_DOCUMENT",
      payload: {
        type: "arc_assignment",
        document: { id: assignmentId, entryKey, arcId },
      },
    });
  }
  context = context.optimisticStateDispatch(context.state, {
    type: "UPDATE_DOCUMENT",
    payload: {
      type: "entry",
      key: entryKey,
      update: {
        contentState: stringifyContentState(contentStateWithAssignment),
      },
    },
  });
  context.reloadEditor();

  return { state: context.state };
};

export const apiUnassignArc = (
  { arcId, entryKey }: { arcId: string; entryKey: string },
  context: APIContext
): APIReturn => {
  if (!Object.keys(context.state.arc).includes(arcId))
    throw new Error("unassignArc: arc not found");

  if (!Object.keys(context.state.entry).includes(entryKey))
    throw new Error("unassignArc: entry not found");

  const contentStateWithoutArc = new IpsumEntityTransformer(
    parseContentState(context.state.entry[entryKey].contentState)
  ).removeEntityData("arcIds", arcId).contentState;

  context = context.optimisticStateDispatch(context.state, {
    type: "UPDATE_DOCUMENT",
    payload: {
      type: "entry",
      key: entryKey,
      update: {
        contentState: stringifyContentState(contentStateWithoutArc),
      },
    },
  });
  context.reloadEditor();

  return { state: context.state };
};

export const apiUpdateArc = (
  { arcId, color }: { arcId: string; color?: number },
  context: APIContext
): APIReturn => {
  if (!Object.keys(context.state.arc).includes(arcId))
    throw new Error(`updateArc: arc not found, ${arcId}`);

  context = context.optimisticStateDispatch(context.state, {
    type: "UPDATE_DOCUMENT",
    payload: { type: "arc", key: arcId, update: { color } },
  });

  return { state: context.state };
};
