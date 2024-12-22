import type { QueryCommentsArgs, StrictTypedTypePolicies } from "util/apollo";
import { IpsumDay } from "util/dates";
import { IpsumTimeMachine } from "util/diff";
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
      commentEntry(entryKey, { readField }) {
        return PROJECT_STATE.collection("commentEntries").get(entryKey) ?? null;
      },
      objectHighlight(objectHighlightId) {
        return (
          PROJECT_STATE.collection("highlights").get(objectHighlightId) ?? null
        );
      },
      htmlString(_, { readField }) {
        const commentEntry = readField<{ entry: string }>("commentEntry");

        const trackedHtmlString = PROJECT_STATE.collection("entries").get(
          commentEntry?.entry
        )?.trackedHTMLString;

        if (!trackedHtmlString) {
          return null;
        }

        const entryHtmlString =
          IpsumTimeMachine.fromString(trackedHtmlString).currentValue;

        return entryHtmlString;
      },
    },
  },
};
