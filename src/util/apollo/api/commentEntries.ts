import { EntryType } from "../__generated__/graphql";
import { autosave } from "../autosave";
import { UnhydratedType, vars } from "../client";
import { createEntry } from "./entries";

export const createCommentEntry = (commentEntry: {
  comment: string;
  htmlString?: string;
}): UnhydratedType["CommentEntry"] => {
  if (!vars.comments()[commentEntry.comment]) {
    throw new Error(
      `createCommentEntry: comment ${commentEntry.comment} not found`
    );
  }

  const commentEntryKey = `comment-entry:${commentEntry.comment}`;

  createEntry({
    entryKey: commentEntryKey,
    htmlString: commentEntry.htmlString ?? "",
    entryType: EntryType.Comment,
  });

  const newCommentEntry: UnhydratedType["CommentEntry"] = {
    __typename: "CommentEntry",
    entry: commentEntryKey,
    comment: commentEntry.comment,
  };

  vars.commentEntries({
    ...vars.commentEntries(),
    [commentEntryKey]: newCommentEntry,
  });

  autosave();

  return newCommentEntry;
};

export const deleteCommentEntry = (entryKey: string) => {
  if (!vars.commentEntries()[entryKey])
    throw new Error(
      `deleteCommentEntry: comment entryKey ${entryKey} not found`
    );

  const newCommentEntries = { ...vars.commentEntries() };
  delete newCommentEntries[entryKey];
  vars.commentEntries(newCommentEntries);

  const newEntries = { ...vars.entries() };
  delete newEntries[entryKey];
  vars.entries(newEntries);

  const newComments = { ...vars.comments() };
  Object.values(newComments).forEach((comment) => {
    if (comment.commentEntry === entryKey) {
      delete comment.commentEntry;
    }
  });

  autosave();
};
