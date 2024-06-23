import { IpsumDay } from "util/dates";
import { v4 as uuidv4 } from "uuid";

import { EntryType } from "../__generated__/graphql";
import { autosave } from "../autosave";
import { UnhydratedType, vars } from "../client";
import { deleteCommentEntry } from "./commentEntries";
import { addCommentToDay, upsertDay } from "./day";
import { createEntry } from "./entries";
import { updateHighlight } from "./highlights";
import { initializeHistory } from "./history";

export const createComment = ({
  id,
  highlight,
  htmlString,
  dayCreated,
}: {
  id?: string;
  highlight: string;
  htmlString?: string;
  dayCreated?: IpsumDay;
}): UnhydratedType["Comment"] => {
  if (!vars.highlights()[highlight]) {
    throw new Error(`createComment: highlight ${highlight} not found`);
  }

  const commentId = id ?? uuidv4();

  const commentEntryKey = `comment-entry:${commentId}`;

  const commentDay = dayCreated ?? IpsumDay.today();

  createEntry({
    dayCreated: commentDay,
    entryKey: commentEntryKey,
    htmlString: htmlString ?? "",
    entryType: EntryType.Comment,
  });

  const commentEntry: UnhydratedType["CommentEntry"] = {
    __typename: "CommentEntry",
    entry: commentEntryKey,
    comment: commentId,
  };

  vars.commentEntries({
    ...vars.commentEntries(),
    [commentEntryKey]: commentEntry,
  });

  const result: UnhydratedType["Comment"] = {
    __typename: "Comment",
    id: commentId,
    parent: null,
    highlight,
    commentEntry: commentEntryKey,
    history: initializeHistory({ dateCreated: dayCreated }),
  };
  vars.comments({ ...vars.comments(), [commentId]: result });

  updateHighlight({
    id: highlight,
    comments: [...vars.highlights()[highlight].comments, commentId],
  });

  upsertDay({ day: commentDay.toString("stored-day") });
  addCommentToDay({
    day: commentDay.toString("stored-day"),
    commentId: commentId,
  });

  autosave();

  return result;
};

export const deleteComment = (id: string) => {
  if (!vars.comments()[id]) return;

  const comment = vars.comments()[id];

  const newComments = { ...vars.comments() };
  delete newComments[id];
  vars.comments(newComments);

  const commentEntry = comment.commentEntry;
  deleteCommentEntry(commentEntry);

  const highlight = comment.highlight;
  if (highlight) {
    updateHighlight({
      id: highlight,
      comments: vars
        .highlights()
        /* eslint-disable no-unexpected-multiline */
        [highlight].comments.filter((comment) => comment !== id),
    });
  }

  autosave();
};
