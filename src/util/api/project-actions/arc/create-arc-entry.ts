import { EntryType } from "util/apollo";
import { IpsumDay } from "util/dates";
import { InMemoryArcEntry } from "util/state";

import { createEntry } from "../entry/create-entry";
import { APIFunction } from "../types";

export const createArcEntry: APIFunction<
  {
    arcName: string;
    arcId: string;
    dayCreated?: IpsumDay;
    htmlString?: string;
  },
  InMemoryArcEntry
> = (args, context) => {
  const { projectState } = context;

  const arcEntryKey = `arc-entry:${args.arcName}:${args.arcId}`;

  const entry = createEntry(
    {
      dayCreated: args.dayCreated,
      entryKey: arcEntryKey,
      htmlString: args.htmlString ?? "",
      entryType: EntryType.Arc,
    },
    context
  );

  const arcEntry = projectState.collection("arcEntries").create(arcEntryKey, {
    __typename: "ArcEntry",
    entry: entry.entryKey,
    arc: args.arcId,
  });

  return arcEntry;
};
