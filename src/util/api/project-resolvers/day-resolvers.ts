import { StrictTypedTypePolicies } from "util/apollo/__generated__/apollo-helpers";
import { IpsumTimeMachine } from "util/diff";
import { PROJECT_STATE } from "util/state";

export const DayResolvers: StrictTypedTypePolicies = {
  Query: {
    fields: {
      day(_, { args }) {
        if (!args?.day) {
          return null;
        }
        return PROJECT_STATE.collection("days").get(args.day) ?? null;
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

        const journalEntry = PROJECT_STATE.collection("journalEntries").get(
          day.journalEntry
        );
        if (!journalEntry) {
          return true;
        }

        const entry = PROJECT_STATE.collection("entries").get(
          journalEntry.entry
        );

        const timeMachine = IpsumTimeMachine.fromString(
          entry.trackedHTMLString
        );

        return timeMachine.currentValue && timeMachine.currentValue !== "";
      },
      comments(comments) {
        return comments.map((commentId: string) =>
          PROJECT_STATE.collection("comments").get(commentId)
        );
      },
    },
  },
};
