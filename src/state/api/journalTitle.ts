import { APIContext } from "./use-api-action";

export const apiUpdateJournalTitle = (
  { title }: { title: string },
  context: APIContext
) => {
  return [
    (context: APIContext, previousReturn: any) => {
      context.dispatch({ type: "UPDATE-JOURNAL-TITLE", payload: { title } });
    },
  ];
};
