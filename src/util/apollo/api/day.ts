import { IpsumDay } from "util/dates";
import { autosave } from "util/serializer";

import { vars } from "../client";

export const upsertDay = ({
  day,
  ratedHighlights,
}: {
  day: string;
  ratedHighlights?: string[];
}) => {
  const ipsumDay = IpsumDay.fromString(day, "stored-day");

  if (!ipsumDay.toLuxonDateTime().isValid) {
    throw new Error(`upsertDay: Invalid day: ${day}`);
  }

  const existingDay = vars.days()[day];

  vars.days({
    ...vars.days(),
    [day]: {
      __typename: "Day",
      day,
      journalEntry: vars.journalEntries()[day]?.entryKey,
      ratedHighlights: ratedHighlights ?? existingDay?.ratedHighlights ?? [],
      // TODO
      changedArcEntries: [],
      comments: existingDay?.comments ?? [],
    },
  });

  autosave();
};

export const addCommentToDay = ({
  day,
  commentId,
}: {
  day: string;
  commentId: string;
}) => {
  const dayObj = vars.days()[day];
  if (!dayObj) return;

  const newDay = {
    ...dayObj,
    comments: [...dayObj.comments, commentId],
  };

  vars.days({ ...vars.days(), [day]: newDay });

  autosave();
};

export const upsertDayForToday = () => {
  const today = IpsumDay.today();
  upsertDay({ day: today.toString("stored-day") });
};

export const deleteDayIfEmpty = (dayKey: string): boolean => {
  const day = vars.days()[dayKey];
  if (!day) return false;

  if (
    !day.journalEntry &&
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
