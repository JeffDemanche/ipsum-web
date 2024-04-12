import { useQuery } from "@apollo/client";
import React from "react";
import { gql } from "util/apollo";
import { IpsumDay } from "util/dates";

import { HighlightComment } from "./HighlightComment";
import styles from "./HighlightDetail.less";

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
        key={isToday ? "today" : comment.id}
        editable={isToday}
        depth={0}
        highlightId={highlightId}
        commentId={comment.id}
        dayIso={comment.history.dateCreated}
        className={styles["comment"]}
      />
    );
  });

  if (!commentToday) {
    commentsElements.unshift(
      <HighlightComment
        key={"today"}
        editable
        depth={0}
        highlightId={highlightId}
        commentId=""
        dayIso={IpsumDay.today().toString("iso")}
        className={styles["comment"]}
      />
    );
  }

  return <>{commentsElements}</>;
};
