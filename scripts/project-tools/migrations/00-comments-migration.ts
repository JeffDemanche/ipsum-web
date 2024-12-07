import { IpsumTimeMachine } from "util/diff";

// 1. Create incomingRelations on highlights
// 2. Remove all commentEntries
// 3. On comment, rename "highlight" to "objectHighlight"
// 4. On comment, add "sourceHighlight"
// 5. On comment, remove "commentEntry"
// 6. On comment, add "sourceEntry"

export default function commentsMigration(data: any) {
  const commentsCopy = { ...data.comments };

  Object.keys(commentsCopy).forEach((comment: any) => {
    const commentEntry = data.commentEntries[comment.commentEntry];

    const entry = data.entries[commentEntry.entry];

    const htmlString = IpsumTimeMachine.fromString(entry.trackedHTMLString);
  });
}
