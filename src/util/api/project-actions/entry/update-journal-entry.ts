import { EntryType } from "util/apollo";
import { IpsumTimeMachine } from "util/diff";
import { isEmptyHTMLString } from "util/excerpt";

import type { APIFunction } from "../types";
import { deleteJournalEntry } from "./delete-journal-entry";

export const updateJournalEntry: APIFunction<
  {
    entryKey: string;
    htmlString?: string;
  },
  boolean
> = (args, context) => {
  const { projectState } = context;

  if (!args.entryKey) {
    return false;
  }

  const entry = projectState.collection("entries").get(args.entryKey);

  if (!entry || entry.entryType !== EntryType.Journal) {
    return false;
  }

  if (args.htmlString && isEmptyHTMLString(args.htmlString)) {
    deleteJournalEntry({ entryKey: args.entryKey }, context);
  } else {
    projectState.collection("entries").mutate(args.entryKey, (entry) => ({
      ...entry,
      trackedHTMLString: IpsumTimeMachine.create(args.htmlString).toString(),
    }));
  }

  return true;
};
