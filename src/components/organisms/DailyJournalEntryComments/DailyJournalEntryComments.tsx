import { CommentBlurb } from "components/molecules/CommentBlurb";
import React from "react";
import { IpsumDay } from "util/dates";

interface DailyJournalEntryCommentsProps {
  today: IpsumDay;
  comments: React.ComponentProps<typeof CommentBlurb>["comment"][];
  onCreateCommentEntry: (commentId: string, htmlString: string) => string;
  onUpdateCommentEntry: (
    commentId: string,
    args: { entryKey: string; htmlString: string }
  ) => boolean;
  onDeleteCommentEntry: (commentId: string, entryKey: string) => void;
  onCreateCommentHighlight: (commentId: string) => string;
  onDeleteCommentHighlight: (commentId: string, highlightId: string) => void;
  onCommentHighlightClick?: (commentId: string, highlightId: string) => void;
  onCommentHighlightObjectClick?: (
    commentId: string,
    args: {
      highlightId: string;
      object: React.ComponentProps<
        typeof CommentBlurb
      >["comment"]["highlight"]["object"];
    }
  ) => void;
}

export const DailyJournalEntryComments: React.FunctionComponent<
  DailyJournalEntryCommentsProps
> = ({
  today,
  comments,
  onCreateCommentEntry,
  onUpdateCommentEntry,
  onDeleteCommentEntry,
  onCreateCommentHighlight,
  onDeleteCommentHighlight,
  onCommentHighlightClick,
  onCommentHighlightObjectClick,
}) => {
  if (!comments) {
    return null;
  }

  return (
    <div>
      {comments.map((comment) => (
        <CommentBlurb
          key={comment.id}
          today={today}
          comment={{
            id: comment.id,
            day: comment.day,
            highlight: comment.highlight,
            commentEntry: comment.commentEntry,
          }}
          onCreateEntry={(htmlString) =>
            onCreateCommentEntry?.(comment.id, htmlString)
          }
          onUpdateEntry={(args) => onUpdateCommentEntry?.(comment.id, args)}
          onDeleteEntry={(entryKey) =>
            onDeleteCommentEntry?.(comment.id, entryKey)
          }
          onCreateHighlight={() => onCreateCommentHighlight?.(comment.id)}
          onDeleteHighlight={(highlightId) =>
            onDeleteCommentHighlight?.(comment.id, highlightId)
          }
          onHighlightClick={(highlightId) =>
            onCommentHighlightClick?.(comment.id, highlightId)
          }
          onHighlightObjectClick={(highlightId, object) =>
            onCommentHighlightObjectClick?.(comment.id, { highlightId, object })
          }
        ></CommentBlurb>
      ))}
    </div>
  );
};
