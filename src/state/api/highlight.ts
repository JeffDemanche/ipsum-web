import { APIContext, APIReturn } from "./use-api-action";
import { IpsumEntityTransformer } from "util/entities";
import { parseContentState, stringifyContentState } from "util/content-state";

export const apiDeleteHighlight = (
  { highlightId }: { highlightId: string },
  context: APIContext
): APIReturn => {
  const highlight = context.state.highlight[highlightId];

  const contentStateWithoutHighlight = new IpsumEntityTransformer(
    parseContentState(context.state.entry[highlight.entryKey].contentState)
  ).removeEntityData("textArcAssignments", {
    arcAssignmentId: highlight.id,
    arcId: highlight.arcId,
  }).contentState;

  context = context.optimisticStateDispatch(context.state, {
    type: "UPDATE_DOCUMENT",
    payload: {
      type: "entry",
      key: highlight.entryKey,
      update: {
        contentState: stringifyContentState(contentStateWithoutHighlight),
      },
    },
  });
  context = context.optimisticStateDispatch(context.state, {
    type: "REMOVE_DOCUMENT",
    payload: {
      type: "highlight",
      key: highlight.id,
    },
  });

  return { state: context.state };
};
