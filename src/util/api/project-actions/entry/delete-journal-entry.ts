import { IpsumDay } from "util/dates";

import { updateDay } from "../day/update-day";
import { APIFunction } from "../types";

export const deleteJournalEntry: APIFunction<
  {
    entryKey: string;
  },
  boolean
> = (args, context) => {
  const { projectState } = context;

  const day = IpsumDay.fromString(args.entryKey, "stored-day");

  updateDay({ day, journalEntryKey: () => null }, context);

  const comments = projectState
    .collection("comments")
    .getAllByField("sourceEntry", args.entryKey);

  Object.values(comments).forEach((comment) => {
    projectState.collection("comments").delete(comment.id);
  });

  projectState.collection("entries").delete(args.entryKey);

  return projectState.collection("journalEntries").delete(args.entryKey);
};
