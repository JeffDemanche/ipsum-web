import { IpsumDay } from "util/dates";
import { InMemoryArc } from "util/state";
import { v4 as uuidv4 } from "uuid";

import { APIFunction } from "../types";
import { createArcEntry } from "../entry/create-arc-entry";

export const createArc: APIFunction<
  {
    id?: string;
    dayCreated?: IpsumDay;
    name: string;
    hue?: number;
    entryHtmlString?: string;
  },
  InMemoryArc
> = (args, context) => {
  const { projectState } = context;

  const id = args.id ?? uuidv4();

  const dayCreated = args.dayCreated ?? IpsumDay.today();

  const arcEntry = createArcEntry(
    {
      arcId: id,
      arcName: args.name,
      dayCreated,
      htmlString: args.entryHtmlString,
    },
    context
  );

  const arc = projectState.collection("arcs").create(id, {
    __typename: "Arc",
    id,
    name: args.name,
    color: args.hue ?? 0,
    arcEntry: arcEntry.entry,
    history: {
      __typename: "History",
      dateCreated: dayCreated.toString("iso"),
    },
    incomingRelations: [],
    outgoingRelations: [],
  });

  return arc;
};
