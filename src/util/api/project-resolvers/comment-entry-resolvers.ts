import type { QueryCommentEntriesArgs, StrictTypedTypePolicies } from "util/apollo";
import { PROJECT_STATE } from "util/state";

export const CommentEntryResolvers: StrictTypedTypePolicies = {
  Query: {
    fields: {
      commentEntry(_, { args }) {
        if (args?.entryKey) {
          return (
            PROJECT_STATE.collection("commentEntries").get(args.entryKey) ??
            null
          );
        }
        return null;
      },
      commentEntries(_, { args }: { args: QueryCommentEntriesArgs }) {
        if (args?.entryKeys) {
          return args.entryKeys.map((entryKey) =>
            PROJECT_STATE.collection("commentEntries").get(entryKey)
          );
        }
        return Object.values(
          PROJECT_STATE.collection("commentEntries").getAll()
        );
      },
    },
  },
  CommentEntry: {
    keyFields: ["entry"],
    fields: {
      comment(commentId) {
        return PROJECT_STATE.collection("comments").get(commentId);
      },
      entry(entryKey) {
        return PROJECT_STATE.collection("entries").get(entryKey);
      },
    },
  },
};
