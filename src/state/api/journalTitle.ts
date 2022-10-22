import { APIContext } from "./use-api-action";

export const apiUpdateJournalTitle = (
  { title }: { title: string },
  context: APIContext
) => {
  context.dispatch({ type: "UPDATE-JOURNAL-TITLE", payload: { title } });
};
