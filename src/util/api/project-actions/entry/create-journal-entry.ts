import { EntryType } from "util/apollo";
import { IpsumDay } from "util/dates";

import { APIFunction } from "../types";
import { InMemoryJournalEntry } from "util/state/project/types";
import { createEntry } from "./create-entry";

export const createJournalEntry: APIFunction<
  {
    dayCreated?: IpsumDay;
    entryKey: string;
    htmlString: string;
  },
  InMemoryJournalEntry
> = (args, context) => {
  const { projectState } = context;

  const entry = createEntry(
    {
      dayCreated: args.dayCreated,
      entryKey: args.entryKey,
      htmlString: args.htmlString,
      entryType: EntryType.Journal,
    },
    context
  );

  const journalEntry = projectState
    .collection("journalEntries")
    .create(entry.entryKey, {
      __typename: "JournalEntry",
      entry: entry.entryKey,
      entryKey: entry.entryKey,
    });

  return journalEntry;
};
