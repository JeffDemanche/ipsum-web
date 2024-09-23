import { EntryType } from "util/apollo";
import { IpsumTimeMachine } from "util/diff";

import { APIFunction } from "../types";

export const updateJournalEntry: APIFunction<
  {
    entryKey: string;
    htmlString?: string;
  },
  boolean
> = (args, context) => {
  const { projectState } = context;

  const entry = projectState.collection("entries").get(args.entryKey);

  if (!entry || entry.entryType !== EntryType.Journal) {
    return false;
  }

  projectState.collection("entries").mutate(args.entryKey, (entry) => ({
    ...entry,
    trackedHTMLString: IpsumTimeMachine.create(args.htmlString).toString(),
  }));

  return true;
};
