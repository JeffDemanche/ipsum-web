import { useQuery } from "@apollo/client";
import { Comments } from "components/molecules/Comments";
import { gql } from "util/apollo";
import { IpsumDay } from "util/dates";

export type CommentsConnectedProps = Pick<
  React.ComponentProps<typeof Comments>,
  "today" | "comments" | "onCreateComment" | "onUpdateComment"
>;

const UseCommentsConnectedQuery = gql(`
  query UseCommentsConnected($highlightId: ID!) {
    highlight(id: $highlightId) {
      id
      comments {
        id
        history {
          dateCreated
        }
        commentEntry {
          entry {
            highlights {
              id
              number
              hue
              outgoingRelations {
                id
                predicate
                object {
                  ... on Arc {
                    id
                    name
                  }
                }
              }
            }
            entryKey
            htmlString
          }
        }
      }
    }
  }
`);

interface UseCommentsConnectedProps {
  highlightId: string;
}

export const useCommentsConnected = ({
  highlightId,
}: UseCommentsConnectedProps): CommentsConnectedProps => {
  const { data } = useQuery(UseCommentsConnectedQuery, {
    variables: {
      highlightId,
    },
  });

  const comments: CommentsConnectedProps["comments"] =
    data?.highlight.comments.map((comment) => ({
      id: comment.id,
      day: IpsumDay.fromString(comment.history.dateCreated, "iso"),
      commentEntry: {
        highlights: comment.commentEntry.entry.highlights.map((highlight) => ({
          highlightId: highlight.id,
          highlightNumber: highlight.number,
          hue: highlight.hue,
          arcNames: highlight.outgoingRelations.map(
            (relation) => relation.object.name
          ),
        })),
        htmlString: comment.commentEntry.entry.htmlString,
      },
    }));

  return {
    today: IpsumDay.today(),
    comments: comments ?? [],
    onCreateComment: () => "",
    onUpdateComment: () => false,
  };
};
