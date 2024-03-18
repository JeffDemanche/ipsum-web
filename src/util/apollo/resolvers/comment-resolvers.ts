import { StrictTypedTypePolicies } from "../__generated__/apollo-helpers";
import { QueryCommentsArgs } from "../__generated__/graphql";
import { vars } from "../client";

export const CommentResolvers: StrictTypedTypePolicies = {
  Query: {
    fields: {
      comment(_, { args }) {
        if (args?.id) {
          return vars.comments()[args.id] ?? null;
        }
        return null;
      },
      comments(_, { args }: { args: QueryCommentsArgs }) {
        if (args?.ids) {
          return args.ids.map((id) => vars.comments()[id]);
        }
        return Object.values(vars.comments());
      },
    },
  },
  Comment: {
    keyFields: ["id"],
    fields: {
      commentEntry(commentEntryKey) {
        return vars.commentEntries()[commentEntryKey] ?? null;
      },
      highlight(highlightId) {
        return vars.highlights()[highlightId] ?? null;
      },
    },
  },
};
