import { IpsumDay } from "util/dates";
import { InMemoryHighlight } from "util/state/project/types";
import { v4 as uuidv4 } from "uuid";

import { APIFunction } from "../types";

export const createHighlight: APIFunction<
  {
    id?: string;
    entryKey: string;
    dayCreated?: IpsumDay;
  },
  InMemoryHighlight
> = (args, context) => {
  const { projectState } = context;

  const id = args.id ?? uuidv4();

  const dayCreated = args.dayCreated?.toString() ?? IpsumDay.today().toString();

  const highlight = projectState
    .collection("highlights")
    .create(args.entryKey, {
      __typename: "Highlight",
      id,
      entry: args.entryKey,
      comments: [],
      history: {
        __typename: "History",
        dateCreated: dayCreated,
      },
      outgoingRelations: [],
      importanceRatings: [],
    });

  return highlight;
};
