import type { QueryJournalEntriesArgs, StrictTypedTypePolicies } from "util/apollo";
import { parseIpsumDateTime } from "util/dates";
import { IpsumTimeMachine } from "util/diff";
import { PROJECT_STATE } from "util/state";

const isJournalEntryEmpty = (trackedHTMLString: string) =>
  IpsumTimeMachine.fromString(trackedHTMLString).currentValue !== "";

export const JournalEntryResolvers: StrictTypedTypePolicies = {
  Query: {
    fields: {
      recentJournalEntries(_, { args }) {
        return Object.values(PROJECT_STATE.collection("entries").getAll())
          .filter(
            (entry) =>
              entry.entryType === "JOURNAL" &&
              (args?.includeEmpty ||
                isJournalEntryEmpty(entry.trackedHTMLString))
          )
          .sort(
            (a, b) =>
              parseIpsumDateTime(b.history.dateCreated)
                .dateTime.toJSDate()
                .getTime() -
              parseIpsumDateTime(a.history.dateCreated)
                .dateTime.toJSDate()
                .getTime()
          )
          .slice(0, args?.count);
      },
      journalEntryDates(_, { args }) {
        if (args?.includeEmpty) {
          return Object.keys(
            PROJECT_STATE.collection("journalEntries").getAll()
          );
        } else {
          return Object.keys(
            PROJECT_STATE.collection("journalEntries").getAll()
          ).filter((entry) => {
            const journalEntry =
              PROJECT_STATE.collection("journalEntries").get(entry);
            const entryData = PROJECT_STATE.collection("entries").get(
              journalEntry.entry
            );
            return (
              entryData && isJournalEntryEmpty(entryData.trackedHTMLString)
            );
          });
        }
      },
      journalEntry(_, { args }) {
        if (args.entryKey) {
          return (
            PROJECT_STATE.collection("journalEntries").get(args.entryKey) ??
            null
          );
        }
        return null;
      },
      journalEntryKeys(_, { args }) {
        if (args?.includeEmpty) {
          return Object.keys(
            PROJECT_STATE.collection("journalEntries").getAll()
          );
        } else {
          return Object.keys(
            PROJECT_STATE.collection("journalEntries").getAll()
          ).filter((entry) => {
            const journalEntry =
              PROJECT_STATE.collection("journalEntries").get(entry);
            const entryData = PROJECT_STATE.collection("entries").get(
              journalEntry.entry
            );
            return (
              entryData && isJournalEntryEmpty(entryData.trackedHTMLString)
            );
          });
        }
      },
      journalEntries(_, { args }: { args: QueryJournalEntriesArgs }) {
        if (args?.entryKeys) {
          return args.entryKeys
            .map((entryKey) =>
              PROJECT_STATE.collection("journalEntries").get(entryKey)
            )
            .filter(Boolean);
        }
        return Object.values(
          PROJECT_STATE.collection("journalEntries").getAll()
        );
      },
    },
  },
  JournalEntry: {
    keyFields: ["entryKey"],
    fields: {
      entry(_, { readField }) {
        return (
          PROJECT_STATE.collection("entries").get(
            readField<string>("entryKey")
          ) ?? null
        );
      },
    },
  },
};
