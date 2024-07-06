import { InMemoryDay } from "util/state/project/types";
import { APIFunction } from "../types";
import { IpsumDay } from "util/dates";

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
