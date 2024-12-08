import { IpsumDay } from "util/dates";
import { IpsumTimeMachine } from "util/diff";
import { InMemoryComment } from "util/state";
import { v4 as uuidv4 } from "uuid";

import { updateDay } from "../day/update-day";
import { createJournalEntry } from "../entry/create-journal-entry";
import { updateJournalEntry } from "../entry/update-journal-entry";
import { createHighlight } from "../highlight/create-highlight";
import { createRelationFromHighlightToHighlight } from "../relation/create-relation-from-highlight-to-highlight";
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

  const id = args.id ?? uuidv4();
  const dayCreated = args.dayCreated;

  const sourceHighlightEntryKey = dayCreated.toString("entry-printed-date");

  if (!projectState.collection("entries").has(sourceHighlightEntryKey)) {
    // Case where today's journal entry doesn't exist yet. We need to create it.
    createJournalEntry(
      {
        dayCreated,
        entryKey: sourceHighlightEntryKey,
        htmlString: args.htmlString,
      },
      context
    );
  } else {
    // Case where today's journal entry already exists. We need to perform logic
    // to append the new comment to it.
    const sourceHighlightEntry = projectState
      .collection("entries")
      .get(sourceHighlightEntryKey);
    const sourceHighlightEntryCurrentHTML = IpsumTimeMachine.fromString(
      sourceHighlightEntry.trackedHTMLString
    ).currentValue;
    const appendedHTMLString = `${sourceHighlightEntryCurrentHTML}${args.htmlString}`;

    updateJournalEntry(
      { entryKey: sourceHighlightEntryKey, htmlString: appendedHTMLString },
      context
    );
  }

  const sourceHighlight = createHighlight(
    { dayCreated, entryKey: sourceHighlightEntryKey },
    context
  );

  createRelationFromHighlightToHighlight(
    {
      subject: sourceHighlight.id,
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

  const comment = projectState.collection("comments").create(id, {
    __typename: "Comment",
    id,
    sourceEntry: sourceHighlightEntryKey,
    objectHighlight: args.objectHighlight,
    sourceHighlight: sourceHighlight.id,
    parent: null,
    history: {
      __typename: "History",
      dateCreated: dayCreated.toString("iso"),
    },
  });

  updateDay(
    {
      day: dayCreated,
      comments: (previous) => [...previous, id],
      journalEntryKey: () => sourceHighlightEntryKey,
    },
    context
  );

  return comment;
};
