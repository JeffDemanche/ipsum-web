import { IpsumDay } from "util/dates";

import { updateDay } from "../day/update-day";
import type { APIFunction } from "../types";

export const deleteJournalEntry: APIFunction<
  {
    entryKey: string;
  },
  boolean
> = (args, context) => {
  const { projectState } = context;

  const day = IpsumDay.fromString(args.entryKey, "stored-day");

  updateDay({ day, journalEntryKey: () => null }, context);

  projectState.collection("entries").delete(args.entryKey);

  return projectState.collection("journalEntries").delete(args.entryKey);
};
