import type { QueryDaysArgs, StrictTypedTypePolicies } from "util/apollo";
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
      days(_, { args }: { args: QueryDaysArgs }) {
        if (args.days) {
          return args.days.map((day) =>
            PROJECT_STATE.collection("days").get(day)
          );
        }
        return Object.values(PROJECT_STATE.collection("days").getAll());
      },
      daysWithJournalEntryOrComments() {
        return Object.values(PROJECT_STATE.collection("days").getAll()).filter(
          (day) => day.journalEntry || day.comments?.length > 0
        );
      },
    },
  },
  Day: {
    keyFields: ["day"],
    fields: {
      day(day) {
        return day;
      },
      journalEntry(day) {
        if (!day) return null;

        return PROJECT_STATE.collection("journalEntries").get(day) ?? null;
      },
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
      srsCardsReviewed(day) {
        return day.srsCardsReviewed.map((srsCardId: string) =>
          PROJECT_STATE.collection("srsCards").get(srsCardId)
        );
      },
    },
  },
};
