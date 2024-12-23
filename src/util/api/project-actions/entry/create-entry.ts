import type { EntryType } from "util/apollo";
import { IpsumDay } from "util/dates";
import { IpsumTimeMachine } from "util/diff";
import type { InMemoryEntry } from "util/state";

import { createDay } from "../day/create-day";
import type { APIFunction } from "../types";

export const createEntry: APIFunction<
  {
    dayCreated?: IpsumDay;
    entryKey: string;
    htmlString: string;
    entryType: EntryType;
  },
  InMemoryEntry
> = (args, { projectState }) => {
  if (projectState.collection("entries").get(args.entryKey)) return;

  const dayCreated = args.dayCreated ?? IpsumDay.today();

  const entry = projectState.collection("entries").create(args.entryKey, {
    __typename: "Entry",
    entryKey: args.entryKey,
    trackedHTMLString: IpsumTimeMachine.create(
      args.htmlString,
      dayCreated.toIpsumDateTime()
    ).toString(),
    history: {
      __typename: "History",
      dateCreated: dayCreated.toString("iso"),
    },
    entryType: args.entryType,
  });

  createDay({ day: dayCreated }, { projectState });

  return entry;
};
