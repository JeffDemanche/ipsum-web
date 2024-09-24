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

  projectState.collection("entries").delete(args.entryKey);

  const day = IpsumDay.fromString(args.entryKey, "stored-day");

  updateDay({ day, journalEntryKey: () => null }, context);

  return projectState.collection("journalEntries").delete(args.entryKey);
};
