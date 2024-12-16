import { IpsumTimeMachine } from "util/diff";
import { removeCommentDiv } from "util/excerpt";

import { updateJournalEntry } from "../entry/update-journal-entry";
import { APIFunction } from "../types";

export const deleteComment: APIFunction<{ id: string }, boolean> = (
  args,
  context
) => {
  const { projectState } = context;

  if (!projectState.collection("comments").has(args.id)) {
    return false;
  }

  const comment = projectState.collection("comments").get(args.id);

  const sourceEntry = projectState
    .collection("entries")
    .get(comment.sourceEntry);

  const sourceEntryHTMLString = IpsumTimeMachine.fromString(
    sourceEntry.trackedHTMLString
  ).currentValue;

  projectState.collection("comments").delete(args.id);

  updateJournalEntry(
    {
      entryKey: sourceEntry.entryKey,
      htmlString: removeCommentDiv(sourceEntryHTMLString, args.id),
    },
    context
  );

  return true;
};
