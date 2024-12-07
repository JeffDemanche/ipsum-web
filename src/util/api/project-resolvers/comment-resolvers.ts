import { QueryCommentsArgs, StrictTypedTypePolicies } from "util/apollo";
import { IpsumDay } from "util/dates";
import { PROJECT_STATE } from "util/state";

export const CommentResolvers: StrictTypedTypePolicies = {
  Query: {
    fields: {
      comment(_, { args }) {
        if (args?.id) {
          return PROJECT_STATE.collection("comments").get(args.id) ?? null;
        }
        return null;
      },
      comments(_, { args }: { args: QueryCommentsArgs }) {
        if (args?.ids) {
          return args.ids.map((id) =>
            PROJECT_STATE.collection("comments").get(id)
          );
        }
        return Object.values(PROJECT_STATE.collection("comments").getAll());
      },
      commentsForDay(_, { args }) {
        if (args?.day) {
          const ipsumDay = IpsumDay.fromString(args.day, "iso");

          return Object.values(
            PROJECT_STATE.collection("comments").getAll()
          ).filter((comment) => {
            return IpsumDay.fromString(
              comment.history.dateCreated,
              "iso"
            ).equals(ipsumDay);
          });
        }
        return [];
      },
    },
  },
  Comment: {
    keyFields: ["id"],
    fields: {
      sourceEntry(_, { readField }) {
        const journalEntryOnDayCreated = IpsumDay.fromString(
          readField<{ dateCreated: string }>("history").dateCreated,
          "iso"
        ).toString("entry-printed-date");
        return PROJECT_STATE.collection("journalEntries").get(
          journalEntryOnDayCreated
        );
      },
      commentEntry(commentEntryKey) {
        return (
          PROJECT_STATE.collection("commentEntries").get(commentEntryKey) ??
          null
        );
      },
      highlight(highlightId) {
        return PROJECT_STATE.collection("highlights").get(highlightId) ?? null;
      },
    },
  },
};
