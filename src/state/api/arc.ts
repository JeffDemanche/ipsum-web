import { SelectionState } from "draft-js";
import { APIContext } from "./use-api-action";
import { v4 as uuidv4 } from "uuid";
import { nextHue } from "util/colors";

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
  const color = nextHue(context.state.journalMetadata.lastArcHue);

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
  context.dispatch({
    type: "UPDATE-JOURNAL-METADATA",
    payload: { journalMetadata: { lastArcHue: color } },
  });
  context.reloadEditor();
};
