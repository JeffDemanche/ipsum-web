import { IpsumDay } from "util/dates";
import { InMemoryDay } from "util/state";

import { APIFunction } from "../types";
import { createDay } from "./create-day";

export const updateDay: APIFunction<
  {
    day: IpsumDay;
    journalEntryKey?: string;
    ratedHighlights?: string[];
    changedArcEntries?: string[];
    comments?: string[];
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
      journalEntry: args.journalEntryKey ?? day.journalEntry,
      ratedHighlights: args.ratedHighlights ?? day.ratedHighlights,
      changedArcEntries: args.changedArcEntries ?? day.changedArcEntries,
      comments: args.comments ?? day.comments,
    }));

  return projectState.collection("days").get(args.day.toString("stored-day"));
};
