import { IpsumDay } from "util/dates";
import type { InMemoryComment } from "util/state";
import { v4 as uuidv4 } from "uuid";

import { updateDay } from "../day/update-day";
import { createCommentEntry } from "../entry/create-comment-entry";
import { createRelationFromCommentToHighlight } from "../relation/create-relation-from-comment-to-highlight";
import type { APIFunction } from "../types";

export const createComment: APIFunction<
  {
    id?: string;
    dayCreated: IpsumDay;
    objectHighlight: string;
    htmlString: string;
  },
  InMemoryComment
> = (args, context) => {
  const { projectState } = context;

  if (!projectState.collection("highlights").has(args.objectHighlight)) {
    throw new Error(
      `No highlight with key ${args.objectHighlight} exists in the project state`
    );
  }

  if (projectState.collection("comments").has(args.id)) {
    throw new Error(
      `Comment with id ${args.id} already exists in the project state`
    );
  }

  const otherCommentsOnHighlightOnDay = Object.values(
    projectState
      .collection("comments")
      .getAllByField("objectHighlight", args.objectHighlight)
  ).filter((comment) =>
    IpsumDay.fromString(comment.history.dateCreated, "iso").equals(
      args.dayCreated
    )
  );

  if (otherCommentsOnHighlightOnDay.length > 0) {
    throw new Error(
      `A comment already exists on highlight ${args.objectHighlight} for day ${args.dayCreated.toString("entry-printed-date")}`
    );
  }

  const id = args.id ?? uuidv4();
  const dayCreated = args.dayCreated;

  const commentEntry = createCommentEntry(
    {
      comment: id,
      dayCreated,
      htmlString: args.htmlString,
    },
    context
  );

  const comment = projectState.collection("comments").create(id, {
    __typename: "Comment",
    id,
    commentEntry: commentEntry.entry,
    objectHighlight: args.objectHighlight,
    outgoingRelations: [],
    parent: null,
    history: {
      __typename: "History",
      dateCreated: dayCreated.toString("iso"),
    },
  });

  createRelationFromCommentToHighlight(
    {
      subject: id,
      object: args.objectHighlight,
      predicate: "responds to",
    },
    context
  );

  projectState
    .collection("highlights")
    .mutate(args.objectHighlight, (highlight) => ({
      ...highlight,
      comments: [...highlight.comments, id],
    }));

  updateDay(
    {
      day: dayCreated,
      comments: (previous) => [...previous, id],
    },
    context
  );

  return projectState.collection("comments").get(comment.id);
};
