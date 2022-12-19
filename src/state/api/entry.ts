import { IpsumDateTime } from "util/dates";
import { APIContext } from "./use-api-action";

export const apiCreateOrUpdateEntry = (
  {
    entryKey,
    date,
    contentState,
  }: {
    entryKey: string;
    date: IpsumDateTime;
    contentState: string;
  },
  context: APIContext
) => {
  // TODO self-heal make sure ContentState -> correct arc assignments for this entry.
  context.dispatch({
    type: "CREATE-OR-UPDATE-ENTRY",
    payload: {
      entryKey,
      date,
      contentState,
    },
  });
};

export const apiDeleteEntry = (
  { entryKey }: { entryKey: string },
  context: APIContext
) => {
  context.dispatch({
    type: "DELETE-ENTRY",
    payload: {
      entryKey,
    },
  });
};
