import { UnhydratedType, vars } from "../client";
import { EntryType } from "../__generated__/graphql";
import { createEntry } from "./entries";

export const createJournalEntry = (journalEntry: {
  entryKey: string;
  stringifiedContentState: string;
  entryType: EntryType;
}): UnhydratedType["JournalEntry"] => {
  const entry = createEntry({
    entryKey: journalEntry.entryKey,
    stringifiedContentState: journalEntry.stringifiedContentState,
    entryType: journalEntry.entryType,
  });

  const newJournalEntry: UnhydratedType["JournalEntry"] = {
    __typename: "JournalEntry",
    entry: entry.entryKey,
    entryKey: entry.entryKey,
  };

  vars.journalEntries({
    ...vars.journalEntries(),
    [entry.entryKey]: newJournalEntry,
  });

  return newJournalEntry;
};

export const deleteJournalEntry = ({ entryKey }: { entryKey: string }) => {
  const journalEntriesCopy = { ...vars.journalEntries() };
  delete journalEntriesCopy[entryKey];
  vars.journalEntries(journalEntriesCopy);

  const entriesCopy = { ...vars.entries() };
  delete entriesCopy[entryKey];
  vars.entries(entriesCopy);
};