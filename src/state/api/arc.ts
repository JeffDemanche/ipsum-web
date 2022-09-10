import { SelectionState } from "draft-js";
import { APIContext } from "./use-api-action";
import { v4 as uuidv4 } from "uuid";
import { randomHue } from "util/colors";

export const apiCreateAndAssignArc = (
  {
    name,
    entryKey,
    selectionState,
  }: { name: string; entryKey: string; selectionState: SelectionState },
  context: APIContext
) => {
  const arcId = uuidv4();
  const assignmentId = uuidv4();
  const color = randomHue();

  context.dispatch({
    type: "CREATE-ARC",
    payload: { id: arcId, name, color },
  });
  context.dispatch({
    type: "ASSIGN-ARC",
    payload: {
      assignmentId,
      arcId: arcId,
      entryKey,
      selectionState,
    },
  });
  context.reloadEditor();
};