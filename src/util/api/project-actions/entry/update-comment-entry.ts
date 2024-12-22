import { EntryType } from "util/apollo";
import { IpsumDay } from "util/dates";
import { IpsumTimeMachine } from "util/diff";

import type { APIFunction } from "../types";

export const updateCommentEntry: APIFunction<
  {
    entryKey: string;
    htmlString?: string;
    updateDay?: IpsumDay;
  },
  boolean
> = (args, context) => {
  const { projectState } = context;

  const entry = projectState.collection("entries").get(args.entryKey);

  if (!entry || entry.entryType !== EntryType.Comment) {
    return false;
  }

  const updateDay = args.updateDay ?? IpsumDay.today();
  let timeMachine = IpsumTimeMachine.fromString(entry.trackedHTMLString);

  if (args.htmlString) {
    timeMachine = timeMachine.setValueAtDate(
      updateDay.toJsDate(),
      args.htmlString
    );
  }

  projectState.collection("entries").mutate(args.entryKey, (entry) => ({
    ...entry,
    trackedHTMLString: timeMachine.toString(),
  }));

  return true;
};
