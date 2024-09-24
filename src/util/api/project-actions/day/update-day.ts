import { IpsumDay } from "util/dates";
import { InMemoryDay } from "util/state";

import { APIFunction } from "../types";
import { createDay } from "./create-day";

export const updateDay: APIFunction<
  {
    day: IpsumDay;
    journalEntryKey?: (previous: string) => string;
    ratedHighlights?: (previous: string[]) => string[];
    changedArcEntries?: (previous: string[]) => string[];
    comments?: (previous: string[]) => string[];
  },
  InMemoryDay
> = (args, context) => {
  const { projectState } = context;

  const day = projectState
    .collection("days")
    .get(args.day.toString("stored-day"));

  if (!day) {
    createDay({ day: args.day }, context);
  }

  projectState
    .collection("days")
    .mutate(args.day.toString("stored-day"), (day) => ({
      ...day,
      journalEntry: args.journalEntryKey
        ? args.journalEntryKey(day.journalEntry)
        : day.journalEntry,
      ratedHighlights: args.ratedHighlights
        ? args.ratedHighlights(day.ratedHighlights)
        : day.ratedHighlights,
      changedArcEntries: args.changedArcEntries
        ? args.changedArcEntries(day.changedArcEntries)
        : day.changedArcEntries,
      comments: args.comments ? args.comments(day.comments) : day.comments,
    }));

  return projectState.collection("days").get(args.day.toString("stored-day"));
};
