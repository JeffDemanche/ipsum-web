import { useQuery } from "@apollo/client";
import React from "react";
import { gql } from "util/apollo";
import { HighlightComment } from "./HighlightComment";
import { IpsumDay } from "util/dates";

interface HighlightDetailCommentsSectionProps {
  highlightId: string;
}

const HighlightDetailCommentsSectionQuery = gql(`
  query HighlightDetailCommentsSectionQuery($highlightId: ID!) {
    highlight(id: $highlightId) {
      comments {
        id
        history {
          dateCreated
        }
        commentEntry {
          entry {
            entryKey
            htmlString
          }
        }
      }
    }
  }
`);

export const HighlightDetailCommentsSection: React.FunctionComponent<
  HighlightDetailCommentsSectionProps
> = ({ highlightId }) => {
  const { data } = useQuery(HighlightDetailCommentsSectionQuery, {
    variables: {
      highlightId,
    },
  });

  const commentToday = !!data.highlight.comments.find((comment) =>
    IpsumDay.fromString(comment.history.dateCreated, "iso").isToday()
  );

  const commentsElements = data.highlight.comments.map((comment) => {
    const isToday = IpsumDay.fromString(
      comment.history.dateCreated,
      "iso"
    ).isToday();

    return (
      <HighlightComment
        key={comment.id}
        editable={isToday}
        depth={0}
        htmlString={comment.commentEntry.entry.htmlString}
        commentId={comment.id}
        commentEntryKey={comment.commentEntry.entry.entryKey}
        dayIso={comment.history.dateCreated}
      />
    );
  });

  if (!commentToday) {
    commentsElements.unshift(
      <HighlightComment
        key="new-comment"
        editable
        depth={0}
        htmlString=""
        commentId=""
        dayIso={IpsumDay.today().toString("iso")}
        commentEntryKey=""
      />
    );
  }

  return <>{commentsElements}</>;
};
