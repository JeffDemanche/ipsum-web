import { IpsumDay } from "util/dates";
import { vars } from "../client";

export const upsertDayForToday = () => {
  const today = IpsumDay.today();

  vars.days({
    ...vars.days(),
    [today.toString()]: {
      __typename: "Day",
      day: today.toString(),
      journalEntry: vars.journalEntries()[today.toString()]?.entryKey,
      srsCardReviews: Object.values(vars.srsCardReviews())
        .filter((review) => review.day === today.toString())
        .map((review) => review.id),
      // TODO
      changedArcEntries: [],
      comments: [],
    },
  });
};
