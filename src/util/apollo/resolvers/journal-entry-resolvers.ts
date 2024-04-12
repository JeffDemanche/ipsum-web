import { parseIpsumDateTime } from "util/dates";
import { IpsumTimeMachine } from "util/diff";

import { StrictTypedTypePolicies } from "../__generated__/apollo-helpers";
import { QueryJournalEntriesArgs } from "../__generated__/graphql";
import { vars } from "../client";

const isJournalEntryEmpty = (trackedHTMLString: string) =>
  IpsumTimeMachine.fromString(trackedHTMLString).currentValue !== "";

export const JournalEntryResolvers: StrictTypedTypePolicies = {
  Query: {
    fields: {
      recentJournalEntries(_, { args }) {
        return Object.values(vars.entries())
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
          return Object.keys(vars.journalEntries());
        } else {
          return Object.keys(vars.journalEntries()).filter((entry) => {
            const journalEntry = vars.journalEntries()[entry];
            const entryData = vars.entries()[journalEntry.entry];
            return (
              entryData && isJournalEntryEmpty(entryData.trackedHTMLString)
            );
          });
        }
      },
      journalEntry(_, { args }) {
        if (args.entryKey) {
          return vars.journalEntries()[args.entryKey] ?? null;
        }
        return null;
      },
      journalEntryKeys(_, { args }) {
        if (args?.includeEmpty) {
          return Object.keys(vars.journalEntries());
        } else {
          return Object.keys(vars.journalEntries()).filter((entry) => {
            const journalEntry = vars.journalEntries()[entry];
            const entryData = vars.entries()[journalEntry.entry];
            return (
              entryData && isJournalEntryEmpty(entryData.trackedHTMLString)
            );
          });
        }
      },
      journalEntries(_, { args }: { args: QueryJournalEntriesArgs }) {
        if (args?.entryKeys) {
          return args.entryKeys
            .map((entryKey) => vars.journalEntries()[entryKey])
            .filter(Boolean);
        }
        return Object.values(vars.journalEntries());
      },
    },
  },
  JournalEntry: {
    keyFields: ["entryKey"],
    fields: {
      entry(_, { readField }) {
        return vars.entries()[readField<string>("entryKey")] ?? null;
      },
    },
  },
};
