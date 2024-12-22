import { EntryType } from "util/apollo";
import type { IpsumDay } from "util/dates";
import type { InMemoryCommentEntry } from "util/state";

import type { APIFunction } from "../types";
import { createEntry } from "./create-entry";

export const createCommentEntry: APIFunction<
  {
    comment: string;
    dayCreated?: IpsumDay;
    htmlString?: string;
  },
  InMemoryCommentEntry
> = (args, context) => {
  const { projectState } = context;

  const commentEntryKey = `comment-entry:${args.comment}`;

  createEntry(
    {
      dayCreated: args.dayCreated,
      entryKey: commentEntryKey,
      htmlString: args.htmlString,
      entryType: EntryType.Comment,
    },
    context
  );

  const commentEntry = projectState
    .collection("commentEntries")
    .create(commentEntryKey, {
      __typename: "CommentEntry",
      entry: commentEntryKey,
      comment: args.comment,
    });

  return commentEntry;
};
