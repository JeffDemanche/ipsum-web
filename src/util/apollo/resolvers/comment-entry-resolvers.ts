import { StrictTypedTypePolicies } from "../__generated__/apollo-helpers";
import { QueryCommentEntriesArgs } from "../__generated__/graphql";
import { vars } from "../client";

export const CommentEntryResolvers: StrictTypedTypePolicies = {
  Query: {
    fields: {
      commentEntry(_, { args }) {
        return vars.commentEntries()[args.entryKey] ?? null;
      },
      commentEntries(_, { args }: { args: QueryCommentEntriesArgs }) {
        if (args.entryKeys) {
          return args.entryKeys
            .map((entryKey) => vars.commentEntries()[entryKey])
            .filter(Boolean);
        }
        return Object.values(vars.commentEntries());
      },
    },
  },
  CommentEntry: {
    keyFields: ["entry", "comment"],
    fields: {
      entry(entry) {
        return vars.entries()[entry] ?? null;
      },
      comment(comment) {
        return vars.comments()[comment] ?? null;
      },
    },
  },
};
