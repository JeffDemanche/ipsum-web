import { EntryType } from "util/apollo";
import { IpsumTimeMachine } from "util/diff";
import { excerptCommentDivString, isEmptyHTMLString } from "util/excerpt";

import { deleteComment } from "../comment/delete-comment";
import { APIFunction } from "../types";
import { deleteJournalEntry } from "./delete-journal-entry";

export const updateJournalEntry: APIFunction<
  {
    entryKey: string;
    htmlString?: string;
  },
  boolean
> = (args, context) => {
  const { projectState } = context;

  if (!args.entryKey) {
    return false;
  }

  const entry = projectState.collection("entries").get(args.entryKey);

  if (args.htmlString) {
    // Go through each comment and make sure it's still present an non-empty,
    // delete if not.
    const dayComments = Object.values(
      projectState
        .collection("comments")
        .getAllByField("sourceEntry", args.entryKey)
    );

    dayComments.forEach((comment) => {
      const excerptString = excerptCommentDivString(
        args.htmlString,
        comment.id
      );

      if (!excerptString || isEmptyHTMLString(excerptString)) {
        deleteComment({ id: comment.id }, context);
      }
    });
  }

  if (!entry || entry.entryType !== EntryType.Journal) {
    return false;
  }

  if (args.htmlString && isEmptyHTMLString(args.htmlString)) {
    deleteJournalEntry({ entryKey: args.entryKey }, context);
  } else {
    projectState.collection("entries").mutate(args.entryKey, (entry) => ({
      ...entry,
      trackedHTMLString: IpsumTimeMachine.create(args.htmlString).toString(),
    }));
  }

  return true;
};
