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

export const deleteDayIfEmpty = (dayKey: string): boolean => {
  const day = vars.days()[dayKey];
  if (!day) return false;

  if (
    !day.journalEntry &&
    !day.srsCardReviews.length &&
    !day.changedArcEntries.length &&
    !day.comments.length
  ) {
    const daysCopy = { ...vars.days() };
    delete daysCopy[dayKey];
    vars.days(daysCopy);
    return true;
  }

  return false;
};
