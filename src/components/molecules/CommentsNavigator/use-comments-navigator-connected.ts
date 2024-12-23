import { useQuery } from "@apollo/client";
import type { CommentsNavigator } from "components/molecules/CommentsNavigator";
import { useState } from "react";
import {
  apiCreateComment,
  apiDeleteComment,
  apiUpdateCommentEntry,
  useApiAction,
} from "util/api";
import { gql } from "util/apollo";
import { IpsumDay } from "util/dates";

export type CommentsNavigatorConnectedProps = Pick<
  React.ComponentProps<typeof CommentsNavigator>,
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
        htmlString
        commentEntry {
          entry {
            entryKey
            highlights {
              id
              number
              hue
              arcs {
                id
                name
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

export const useCommentsNavigatorConnected = ({
  highlightId,
}: UseCommentsConnectedProps): CommentsNavigatorConnectedProps => {
  const today = IpsumDay.today();

  const [selectedDay, setSelectedDay] = useState(today);

  const { data } = useQuery(UseCommentsConnectedQuery, {
    variables: {
      highlightId,
    },
  });

  const comments: CommentsNavigatorConnectedProps["comments"] =
    data?.highlight?.comments.filter(Boolean).map((comment) => ({
      id: comment.id,
      day: IpsumDay.fromString(comment.history.dateCreated, "iso"),
      htmlString: comment.htmlString,
      commentEntry: {
        entryKey: comment.commentEntry.entry.entryKey,
        highlights: comment.commentEntry.entry.highlights.map((highlight) => ({
          highlightId: highlight.id,
          highlightNumber: highlight.number,
          hue: highlight.hue,
          arcNames: highlight.arcs.map((arc) => arc.name),
        })),
        htmlString: comment.commentEntry.entry.htmlString,
      },
    }));

  const [createComment] = useApiAction(apiCreateComment);

  const [updateCommentEntry] = useApiAction(apiUpdateCommentEntry);

  const [deleteComment] = useApiAction(apiDeleteComment);

  const onCreateComment = (htmlString: string) => {
    const newComment = createComment({
      dayCreated: selectedDay,
      htmlString,
      objectHighlight: highlightId,
    });
    return newComment.commentEntry;
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

    updateCommentEntry({
      entryKey,
      htmlString,
    });
    return true;
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
