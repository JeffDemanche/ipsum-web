import { APIContext, APIReturn } from "./use-api-action";

export const apiUpdateJournalTitle = (
  { title }: { title: string },
  context: APIContext
): APIReturn => {
  context = context.optimisticStateDispatch(context.state, {
    type: "UPDATE_FIELD",
    payload: { field: "journalTitle", update: title },
  });

  return { state: context.state };
};
