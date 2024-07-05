import { EntryType } from "util/apollo";
import { IpsumDay } from "util/dates";

import { APIFunction } from "../types";
import { InMemoryJournalEntry } from "util/state/project/types";
import { createEntry } from "util/apollo/api/entries";

export const createJournalEntry: APIFunction<
  {
    dayCreated?: IpsumDay;
    entryKey: string;
    htmlString: string;
    entryType: EntryType;
  },
  InMemoryJournalEntry
> = async (args, context) => {
  const entry = createEntry({
    dayCreated: args.dayCreated,
    entryKey: args.entryKey,
    htmlString: args.htmlString,
    entryType: args.entryType,
  });

  const journalEntry = context.state
    .collection("journalEntries")
    .create(entry.entryKey, {
      __typename: "JournalEntry",
      entry: entry.entryKey,
      entryKey: entry.entryKey,
    });

  return journalEntry;
};
