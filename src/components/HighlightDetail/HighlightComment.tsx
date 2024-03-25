import { useQuery } from "@apollo/client";
import { Typography } from "@mui/material";
import React from "react";
import {
  EntryType,
  createComment,
  deleteComment,
  gql,
  updateEntry,
} from "util/apollo";
import { IpsumDay } from "util/dates";
import { IpsumEditor } from "util/editor";
import styles from "./HighlightDetail.less";

interface HighlightCommentProps {
  depth: number;
  dayIso: string;
  highlightId: string;
  commentId: string | undefined;
  editable: boolean;
  className?: string;
}

const HighlightCommentQuery = gql(`
  query HighlightComment($commentId: ID!) {
    comment(id: $commentId) {
      id
      commentEntry {
        entry {
          entryKey
          htmlString
        }
      }
    }
  }
`);

export const HighlightComment: React.FunctionComponent<
  HighlightCommentProps
> = ({ depth, dayIso, highlightId, commentId, editable, className }) => {
  const { data } = useQuery(HighlightCommentQuery, {
    variables: {
      commentId,
    },
  });

  return (
    <div className={className}>
      <Typography variant="h4">
        {IpsumDay.fromString(dayIso, "iso").toString(
          "entry-printed-date-nice-with-year"
        )}
      </Typography>
      <IpsumEditor
        defaultEntryKey={data.comment?.commentEntry?.entry?.entryKey}
        metadata={{ entryType: EntryType.Comment, commentId }}
        allowHighlighting
        createEntry={(htmlString) => {
          const { commentEntry } = createComment({
            highlight: highlightId,
            htmlString,
          });
          return commentEntry;
        }}
        updateEntry={({ entryKey, htmlString }) => {
          return !!updateEntry({
            entryKey,
            htmlString,
          });
        }}
        deleteEntry={() => {
          deleteComment(commentId);
        }}
        editable={editable}
        className={styles["comment-editor"]}
      />
    </div>
  );
};
