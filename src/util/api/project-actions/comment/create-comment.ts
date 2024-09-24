import { IpsumDay } from "util/dates";
import { InMemoryComment } from "util/state";
import { v4 as uuidv4 } from "uuid";

import { apiCreateCommentEntry } from "..";
import { updateDay } from "../day/update-day";
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

  if (!projectState.collection("highlights").has(args.highlight)) {
    throw new Error(
      `No highlight with key ${args.highlight} exists in the project state`
    );
  }

  if (projectState.collection("comments").has(args.id)) {
    throw new Error(
      `Comment with id ${args.id} already exists in the project state`
    );
  }

  const id = args.id ?? uuidv4();
  const dayCreated =
    args.dayCreated?.toString("iso") ?? IpsumDay.today().toString("iso");

  const commentEntryKey = `comment-entry:${id}`;

  const commentEntry = apiCreateCommentEntry(
    {
      comment: id,
      entryKey: commentEntryKey,
      htmlString: args.htmlString,
      dayCreated: IpsumDay.fromString(dayCreated, "iso"),
    },
    context
  );

  projectState.collection("highlights").mutate(args.highlight, (highlight) => ({
    ...highlight,
    comments: [...highlight.comments, id],
  }));

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

  updateDay(
    {
      day: IpsumDay.fromString(dayCreated, "iso"),
      comments: (previous) => [...previous, id],
    },
    context
  );

  return comment;
};
