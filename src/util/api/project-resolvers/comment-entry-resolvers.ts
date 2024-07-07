import { QueryCommentEntriesArgs, StrictTypedTypePolicies } from "util/apollo";
import { PROJECT_STATE } from "util/state";

export const CommentEntryResolvers: StrictTypedTypePolicies = {
  Query: {
    fields: {
      commentEntry(_, { args }) {
        return PROJECT_STATE.collection("commentEntries").get(args.id) ?? null;
      },
      commentEntries(_, { args }: { args: QueryCommentEntriesArgs }) {
        if (args.entryKeys) {
          return args.entryKeys
            .map((entryKey) =>
              PROJECT_STATE.collection("commentEntries").get(entryKey)
            )
            .filter(Boolean);
        }
        return Object.values(
          PROJECT_STATE.collection("commentEntries").getAll()
        );
      },
    },
  },
  CommentEntry: {
    keyFields: ["entry", "comment"],
    fields: {
      entry(entry) {
        return PROJECT_STATE.collection("entries").get(entry) ?? null;
      },
      comment(comment) {
        return PROJECT_STATE.collection("comments").get(comment) ?? null;
      },
    },
  },
};
