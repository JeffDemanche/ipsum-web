import { IpsumDay } from "util/dates";
import { InMemoryDay } from "util/state";

import { APIFunction } from "../types";

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
    });

  return newDay;
};
