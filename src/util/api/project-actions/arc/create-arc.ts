import { IpsumDay } from "util/dates";
import type { InMemoryArc } from "util/state";
import { v4 as uuidv4 } from "uuid";

import { createArcEntry } from "../entry/create-arc-entry";
import type { APIFunction } from "../types";

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

  const numberOfArcs = Object.keys(
    projectState.collection("arcs").getAll()
  ).length;

  const goldenRatioConjugate = 0.618033988749895;

  const hue = ((numberOfArcs * goldenRatioConjugate) % 1.0) * 360;

  const arc = projectState.collection("arcs").create(id, {
    __typename: "Arc",
    id,
    name: args.name,
    color: args.hue ?? hue,
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
