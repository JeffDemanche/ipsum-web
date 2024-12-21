import { Type } from "components/atoms/Type";
import { CommentBlurb } from "components/molecules/CommentBlurb";
import React from "react";
import { IpsumDay } from "util/dates";

interface DailyJournalEntryCommentsProps {
  comments: {
    id: string;
    excerptProps: {
      htmlString: string;
      maxLines?: number;
    };
    day: IpsumDay;
    highlight: {
      id: string;
      objectText: string;
      hue: number;
      highlightNumber: number;
      arcNames: string[];
    };
    commentEntry: React.ComponentProps<
      typeof CommentBlurb
    >["comment"]["commentEntry"];
  }[];
}

export const DailyJournalEntryComments: React.FunctionComponent<
  DailyJournalEntryCommentsProps
> = ({ comments }) => {
  return (
    <div>
      {comments.map((comment) => (
        <CommentBlurb
          key={comment.id}
          excerptProps={comment.excerptProps}
          comment={{
            id: comment.id,
            day: comment.day,
            highlight: comment.highlight,
            commentEntry: comment.commentEntry,
          }}
        ></CommentBlurb>
      ))}
    </div>
  );
};
