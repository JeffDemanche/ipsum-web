import { EntryType } from "util/apollo";
import { IpsumDay } from "util/dates";
import { IpsumTimeMachine } from "util/diff";
import { InMemoryCommentEntry } from "util/state";

import { APIFunction } from "../types";

export const updateCommentEntry: APIFunction<
  {
    entryKey: string;
    htmlString?: string;
    updateDay?: IpsumDay;
  },
  InMemoryCommentEntry
> = (args, context) => {
  const { projectState } = context;

  const entry = projectState.collection("entries").get(args.entryKey);

  if (!entry) {
    throw new Error(
      `No entry with key ${args.entryKey} exists in the project state`
    );
  }

  if (entry.entryType !== EntryType.Comment) {
    throw new Error(`Entry with key ${args.entryKey} is not a comment entry`);
  }

  const timeMachine = IpsumTimeMachine.fromString(entry.trackedHTMLString);
  if (args.htmlString) {
    timeMachine.setValueAtDate(args.updateDay.toJsDate(), args.htmlString);
  }

  projectState.collection("entries").mutate(args.entryKey, (entry) => ({
    ...entry,
    trackedHTMLString: timeMachine.toString(),
  }));

  return projectState.collection("commentEntries").get(args.entryKey);
};
