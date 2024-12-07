import { IpsumTimeMachine } from "util/diff";

export default function commentsMigration(data: any) {
  const commentsCopy = { ...data.comments };

  Object.keys(commentsCopy).forEach((comment: any) => {
    const commentEntry = data.commentEntries[comment.commentEntry];

    const entry = data.entries[commentEntry.entry];

    const htmlString = IpsumTimeMachine.fromString(entry.trackedHTMLString);
  });
}
