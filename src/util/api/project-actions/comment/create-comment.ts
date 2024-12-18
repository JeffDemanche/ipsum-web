import { IpsumDay } from "util/dates";
import { IpsumTimeMachine } from "util/diff";
import { removeEmptyCommentDivs, wrapWithCommentDiv } from "util/excerpt";
import { HighlightWrapper, InMemoryComment } from "util/state";
import { v4 as uuidv4 } from "uuid";

import { updateDay } from "../day/update-day";
import { createJournalEntry } from "../entry/create-journal-entry";
import { updateJournalEntry } from "../entry/update-journal-entry";
import { createRelationFromCommentToHighlight } from "../relation/create-relation-from-comment-to-highlight";
import { APIFunction } from "../types";

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

  const sourceEntryKey = dayCreated.toString("entry-printed-date");

  const objectHighlight = projectState
    .collection("highlights")
    .get(args.objectHighlight);

  const wrappedHighlight = new HighlightWrapper(objectHighlight, projectState);

  const commentWrappedHTMLString = wrapWithCommentDiv(args.htmlString, {
    commentId: id,
    highlightHue: wrappedHighlight.hue,
    highlightNumber: wrappedHighlight.number,
    highlightObjectText: wrappedHighlight.objectText,
  });

  if (!projectState.collection("entries").has(sourceEntryKey)) {
    // Case where today's journal entry doesn't exist yet. We need to create it.
    createJournalEntry(
      {
        dayCreated,
        entryKey: sourceEntryKey,
        htmlString: removeEmptyCommentDivs(commentWrappedHTMLString),
      },
      context
    );
  } else {
    // Case where today's journal entry already exists. We need to perform logic
    // to append the new comment to it.
    const sourceHighlightEntry = projectState
      .collection("entries")
      .get(sourceEntryKey);
    const sourceHighlightEntryCurrentHTML = IpsumTimeMachine.fromString(
      sourceHighlightEntry.trackedHTMLString
    ).currentValue;
    const appendedHTMLString = removeEmptyCommentDivs(
      `${sourceHighlightEntryCurrentHTML}${commentWrappedHTMLString}`
    );

    updateJournalEntry(
      { entryKey: sourceEntryKey, htmlString: appendedHTMLString },
      context
    );
  }

  const comment = projectState.collection("comments").create(id, {
    __typename: "Comment",
    id,
    sourceEntry: sourceEntryKey,
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
      journalEntryKey: () => sourceEntryKey,
    },
    context
  );

  return projectState.collection("comments").get(comment.id);
};
