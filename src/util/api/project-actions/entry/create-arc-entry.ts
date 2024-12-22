import { EntryType } from "util/apollo";
import type { IpsumDay } from "util/dates";
import type { InMemoryArcEntry } from "util/state";

import type { APIFunction } from "../types";
import { createEntry } from "./create-entry";

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
