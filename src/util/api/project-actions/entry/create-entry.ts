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
> = async (args, { state }) => {
  if (state.collection("entries").get(args.entryKey)) return;

  const entry = state.collection("entries").create(args.entryKey, {
    __typename: "Entry",
    entryKey: args.entryKey,
    trackedHTMLString: IpsumTimeMachine.create(args.htmlString).toString(),
    history: {
      __typename: "History",
      dateCreated: IpsumDay.today().toString("iso"),
    },
    entryType: args.entryType,
  });

  return entry;
};
