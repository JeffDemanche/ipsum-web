import { ContentState } from "draft-js";
import { stringifyContentState } from "util/content-state";
import { IpsumDateTime } from "util/dates";
import { APIContext, APIReturn } from "./SCH_use-api-action";

export const apiCreateOrUpdateEntry = (
  {
    entryKey,
    date,
    contentState,
  }: {
    entryKey: string;
    date: IpsumDateTime;
    contentState: ContentState;
  },
  context: APIContext
): APIReturn => {
  const create = !context.state.entry[entryKey];

  // TODO self-heal make sure ContentState -> correct arc assignments for this entry.
  // const updatedTextArcAssignmentIds = new IpsumEntityTransformer(
  //   contentState
  // ).getAppliedTextArcAssignments();

  if (create)
    context = context.optimisticStateDispatch(context.state, {
      type: "CREATE_DOCUMENT",
      payload: {
        type: "entry",
        document: {
          entryKey,
          date: date.dateTime.toISO(),
          contentState: stringifyContentState(contentState),
        },
      },
    });
  else
    context = context.optimisticStateDispatch(context.state, {
      type: "UPDATE_DOCUMENT",
      payload: {
        type: "entry",
        key: entryKey,
        update: {
          date: date.dateTime.toISO(),
          contentState: stringifyContentState(contentState),
        },
      },
    });

  return { state: context.state };
};

export const apiDeleteEntry = (
  { entryKey }: { entryKey: string },
  context: APIContext
): APIReturn => {
  context = context.optimisticStateDispatch(context.state, {
    type: "REMOVE_DOCUMENT",
    payload: {
      type: "entry",
      key: entryKey,
    },
  });

  return { state: context.state };
};
