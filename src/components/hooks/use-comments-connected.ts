import { useQuery } from "@apollo/client";
import { Comments } from "components/molecules/Comments";
import { useState } from "react";
import {
  apiCreateComment,
  apiDeleteComment,
  apiUpdateJournalEntry,
  useApiAction,
} from "util/api";
import { gql } from "util/apollo";
import { IpsumDay } from "util/dates";
import { removeEmptyCommentDivs, replaceCommentDiv } from "util/excerpt";

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
        excerptHtmlString
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
      excerptHtmlString: comment.excerptHtmlString,
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

  const [updateEntry] = useApiAction(apiUpdateJournalEntry);

  const [deleteComment] = useApiAction(apiDeleteComment);

  const onCreateComment = (htmlString: string) => {
    const newComment = createComment({
      dayCreated: selectedDay,
      htmlString,
      objectHighlight: highlightId,
    });
    return newComment.sourceEntry;
  };

  const selectedComment = comments.find((comment) =>
    comment.day.equals(selectedDay)
  );

  const onUpdateComment = ({
    entryKey,
    htmlString,
  }: {
    entryKey: string;
    htmlString: string;
  }) => {
    if (!selectedComment) return false;

    return updateEntry({
      entryKey,
      htmlString: removeEmptyCommentDivs(
        replaceCommentDiv(
          selectedComment.sourceEntry.htmlString,
          htmlString,
          selectedComment.id
        )
      ),
    });
  };

  const onDeleteComment = () => {
    if (!selectedComment) return;

    deleteComment({ id: selectedComment.id });
  };

  return {
    today,
    selectedDay,
    setSelectedDay,
    comments: comments ?? [],
    onCreateComment,
    onUpdateComment,
    onDeleteComment,
    onCreateHighlight: () => "",
    onDeleteHighlight: () => false,
    onHighlightClick: () => "",
  };
};
