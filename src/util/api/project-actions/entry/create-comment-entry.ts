import { EntryType } from "util/apollo";
import { IpsumDay } from "util/dates";
import { IpsumTimeMachine } from "util/diff";
import { InMemoryCommentEntry } from "util/state";

import { APIFunction } from "../types";

export const createCommentEntry: APIFunction<
  {
    dayCreated?: IpsumDay;
    comment: string;
    entryKey: string;
    htmlString?: string;
  },
  InMemoryCommentEntry
> = (args, context) => {
  const { projectState } = context;

  const dayCreated =
    args.dayCreated?.toString("iso") ?? IpsumDay.today().toString("iso");

  const entry = projectState.collection("entries").create(args.entryKey, {
    __typename: "Entry",
    entryKey: args.entryKey,
    entryType: EntryType.Comment,
    history: {
      __typename: "History",
      dateCreated: dayCreated,
    },
    trackedHTMLString: IpsumTimeMachine.create(
      args.htmlString ?? ""
    ).toString(),
  });

  const commentEntry = projectState
    .collection("commentEntries")
    .create(args.entryKey, {
      __typename: "CommentEntry",
      comment: args.comment,
      entry: entry.entryKey,
    });

  return commentEntry;
};
