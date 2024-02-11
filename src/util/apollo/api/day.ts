import { IpsumDay } from "util/dates";
import { vars } from "../client";

export const createDay = (day: string) => {
  const ipsumDay = IpsumDay.fromString(day, "stored-day");
  if (ipsumDay.toLuxonDateTime().isValid) {
    vars.days({
      ...vars.days(),
      [day]: {
        __typename: "Day",
        day,
        journalEntry: vars.journalEntries()[day]?.entryKey,
        srsCardReviews: Object.values(vars.srsCardReviews())
          .filter((review) => review.day === day)
          .map((review) => review.id),
        // TODO
        changedArcEntries: [],
        comments: [],
      },
    });
  }
};

export const upsertDayForToday = () => {
  const today = IpsumDay.today();
  createDay(today.toString("stored-day"));
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
