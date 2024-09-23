import { EntryType } from "util/apollo";
import { IpsumDay } from "util/dates";
import { IpsumTimeMachine } from "util/diff";
import { InMemoryArcEntry } from "util/state";

import { APIFunction } from "../types";

export const updateArcEntry: APIFunction<
  {
    entryKey: string;
    htmlString?: string;
    updateDay?: IpsumDay;
  },
  InMemoryArcEntry
> = (args, context) => {
  const { projectState } = context;

  const entry = projectState.collection("entries").get(args.entryKey);

  if (!entry) {
    throw new Error(
      `No entry with key ${args.entryKey} exists in the project state`
    );
  }

  if (entry.entryType !== EntryType.Arc) {
    throw new Error(`Entry with key ${args.entryKey} is not an arc entry`);
  }

  const timeMachine = IpsumTimeMachine.fromString(entry.trackedHTMLString);
  if (args.htmlString) {
    if (!args.updateDay) {
      throw new Error(
        "updateDay is required when updating an arc entry htmlString"
      );
    }

    timeMachine.setValueAtDate(args.updateDay.toJsDate(), args.htmlString);
  }

  projectState.collection("entries").mutate(args.entryKey, (entry) => ({
    ...entry,
    trackedHTMLString: timeMachine.toString(),
  }));

  return projectState.collection("arcEntries").get(args.entryKey);
};
