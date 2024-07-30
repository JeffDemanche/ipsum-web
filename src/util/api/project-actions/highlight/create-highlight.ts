import { IpsumDay } from "util/dates";
import { InMemoryHighlight } from "util/state";
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

  const dayCreated =
    args.dayCreated?.toString("iso") ?? IpsumDay.today().toString("iso");

  if (!projectState.collection("entries").has(args.entryKey)) {
    throw new Error(
      `No entry with key ${args.entryKey} exists in the project state`
    );
  }

  const highlight = projectState.collection("highlights").create(id, {
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
