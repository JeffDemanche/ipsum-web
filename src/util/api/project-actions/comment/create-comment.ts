import { IpsumDay } from "util/dates";
import { IpsumTimeMachine } from "util/diff";
import { InMemoryComment } from "util/state";
import { v4 as uuidv4 } from "uuid";

import { updateDay } from "../day/update-day";
import { createJournalEntry } from "../entry/create-journal-entry";
import { updateJournalEntry } from "../entry/update-journal-entry";
import { createHighlight } from "../highlight/create-highlight";
import { APIFunction } from "../types";

export const createComment: APIFunction<
  {
    id?: string;
    dayCreated?: IpsumDay;
    highlight: string;
    highlightDay: IpsumDay;
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
  const dayCreated = args.dayCreated ?? IpsumDay.today();

  const highlight = projectState.collection("highlights").get(args.highlight);
  const highlightEntry = projectState
    .collection("entries")
    .get(highlight.entry);
  const highlightEntryCurrentHTML = IpsumTimeMachine.fromString(
    highlightEntry.trackedHTMLString
  ).currentValue;

  const dayCreatedEntryKey = dayCreated.toString("entry-printed-date");

  if (!projectState.collection("entries").has(dayCreatedEntryKey)) {
    createJournalEntry(
      { dayCreated, entryKey: dayCreatedEntryKey, htmlString: "" },
      context
    );
  }

  const appendedHTMLString = `${highlightEntryCurrentHTML}${args.htmlString}`;
  updateJournalEntry(
    { entryKey: dayCreatedEntryKey, htmlString: appendedHTMLString },
    context
  );

  const highlightOnToday = createHighlight(
    { dayCreated, entryKey: dayCreatedEntryKey },
    context
  );

  projectState.collection("highlights").mutate(args.highlight, (highlight) => ({
    ...highlight,
    comments: [...highlight.comments, id],
  }));

  const comment = projectState.collection("comments").create(id, {
    __typename: "Comment",
    id,
    commentEntry: "",
    highlight: args.highlight,
    commentHighlight: highlightOnToday.id,
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
      journalEntryKey: () => dayCreatedEntryKey,
    },
    context
  );

  return comment;
};
