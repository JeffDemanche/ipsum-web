import { useQuery } from "@apollo/client";
import { Comments } from "components/molecules/Comments";
import { useState } from "react";
import { apiCreateComment, useApiAction } from "util/api";
import { gql } from "util/apollo";
import { IpsumDay } from "util/dates";

export type CommentsConnectedProps = Pick<
  React.ComponentProps<typeof Comments>,
  | "today"
  | "selectedDay"
  | "setSelectedDay"
  | "comments"
  | "onCreateComment"
  | "onUpdateComment"
  | "onDeleteComment"
  | "onCreateHighlight"
  | "onDeleteHighlight"
  | "onHighlightClick"
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
        sourceHighlight {
          id
        }
        sourceEntry {
          entry {
            entryKey
            highlights {
              id
              number
              hue
              outgoingRelations {
                object {
                  ... on Arc {
                    name
                  }
                }
              }
            }
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
  const today = IpsumDay.today();

  const [selectedDay, setSelectedDay] = useState(today);

  const { data } = useQuery(UseCommentsConnectedQuery, {
    variables: {
      highlightId,
    },
  });

  const comments: CommentsConnectedProps["comments"] =
    data?.highlight.comments.map((comment) => ({
      id: comment.id,
      day: IpsumDay.fromString(comment.history.dateCreated, "iso"),
      sourceHighlight: comment.sourceHighlight.id,
      sourceEntry: {
        entryKey: comment.sourceEntry.entry.entryKey,
        highlights: comment.sourceEntry.entry.highlights.map((highlight) => ({
          highlightId: highlight.id,
          highlightNumber: highlight.number,
          hue: highlight.hue,
          arcNames: highlight.outgoingRelations
            .map((relation) =>
              relation.object.__typename === "Arc"
                ? relation.object.name
                : undefined
            )
            .filter(Boolean),
        })),
        htmlString: comment.sourceEntry.entry.htmlString,
      },
    }));

  const [createComment] = useApiAction(apiCreateComment);

  const onCreateComment = (htmlString: string) => {
    const newComment = createComment({
      dayCreated: selectedDay,
      htmlString,
      objectHighlight: highlightId,
    });
    return newComment.sourceEntry;
  };

  return {
    today,
    selectedDay,
    setSelectedDay,
    comments: comments ?? [],
    onCreateComment,
    onUpdateComment: () =>
      comments.some((comment) => comment.day.equals(selectedDay)),
    onDeleteComment: () => true,
    onCreateHighlight: () => "",
    onDeleteHighlight: () => false,
    onHighlightClick: () => "",
  };
};
