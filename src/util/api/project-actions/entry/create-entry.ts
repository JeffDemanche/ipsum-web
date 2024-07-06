import { EntryType } from "util/apollo";
import { IpsumDay } from "util/dates";
import { IpsumTimeMachine } from "util/diff";
import { InMemoryEntry } from "util/state/project/types";

import { APIFunction } from "../types";

export const createEntry: APIFunction<
  {
    dayCreated?: IpsumDay;
    entryKey: string;
    htmlString: string;
    entryType: EntryType;
  },
  InMemoryEntry
> = async (args, { projectState }) => {
  if (projectState.collection("entries").get(args.entryKey)) return;

  const entry = projectState.collection("entries").create(args.entryKey, {
    __typename: "Entry",
    entryKey: args.entryKey,
    trackedHTMLString: IpsumTimeMachine.create(args.htmlString).toString(),
    history: {
      __typename: "History",
      dateCreated:
        args.dayCreated?.toString("iso") ?? IpsumDay.today().toString("iso"),
    },
    entryType: args.entryType,
  });

  return entry;
};
