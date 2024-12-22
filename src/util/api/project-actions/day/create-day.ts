import type { IpsumDay } from "util/dates";
import type { InMemoryDay } from "util/state";

import type { APIFunction } from "../types";

export const createDay: APIFunction<{ day: IpsumDay }, InMemoryDay> = (
  { day },
  context
) => {
  if (context.projectState.collection("days").get(day.toString("stored-day")))
    return;

  const newDay = context.projectState
    .collection("days")
    .create(day.toString("stored-day"), {
      __typename: "Day",
      day: day.toString("stored-day"),
      journalEntry: null,
      ratedHighlights: [],
      changedArcEntries: [],
      comments: [],
      srsCardsReviewed: [],
    });

  return newDay;
};
