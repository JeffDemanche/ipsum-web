import { IpsumTimeMachine } from "util/diff";
import { vars } from "../client";
import { StrictTypedTypePolicies } from "../__generated__/apollo-helpers";

export const DayResolvers: StrictTypedTypePolicies = {
  Query: {
    fields: {
      day(_, { args }) {
        if (!args?.day) {
          return null;
        }
        return vars.days()[args.day] ?? null;
      },
    },
  },
  Day: {
    keyFields: ["day"],
    fields: {
      hasJournalEntry(day) {
        if (!day.journalEntry) {
          return true;
        }

        const journalEntry = vars.journalEntries()[day.journalEntry];
        if (!journalEntry) {
          return true;
        }

        const entry = vars.entries()[journalEntry.entry];

        const timeMachine = IpsumTimeMachine.fromString(
          entry.trackedHTMLString
        );

        return timeMachine.currentValue && timeMachine.currentValue !== "";
      },
    },
  },
};
