import { IpsumDay } from "util/dates";
import { InMemoryComment } from "util/state";
import { v4 as uuidv4 } from "uuid";

import { apiCreateCommentEntry } from "..";
import { APIFunction } from "../types";

export const createComment: APIFunction<
  {
    id?: string;
    dayCreated?: IpsumDay;
    highlight: string;
    htmlString: string;
  },
  InMemoryComment
> = (args, context) => {
  const { projectState } = context;

  const id = args.id ?? uuidv4();
  const dayCreated =
    args.dayCreated.toString("iso") ?? IpsumDay.today().toString("iso");

  const commentEntryKey = `comment-entry:${id}`;

  const commentEntry = apiCreateCommentEntry(
    {
      comment: id,
      entryKey: commentEntryKey,
    },
    context
  );

  const comment = projectState.collection("comments").create(id, {
    __typename: "Comment",
    id,
    commentEntry: commentEntry.entry,
    highlight: args.highlight,
    parent: null,
    history: {
      __typename: "History",
      dateCreated: dayCreated,
    },
  });

  return comment;
};
