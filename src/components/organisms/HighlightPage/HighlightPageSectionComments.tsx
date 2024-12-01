import { Type } from "components/atoms/Type";
import { CommentBlurb } from "components/molecules/CommentBlurb";
import { Entry } from "components/molecules/Entry";
import React, { FunctionComponent } from "react";
import { IpsumDay } from "util/dates";

import styles from "./HighlightPage.less";

interface HighlightPageSectionCommentsProps {
  today: IpsumDay;
  comments: {
    id: string;
    day: IpsumDay;
    highlight: React.ComponentProps<
      typeof CommentBlurb
    >["comment"]["highlight"];
    commentEntry: {
      highlights: React.ComponentProps<typeof Entry>["highlights"];
      htmlString: string;
    };
  }[];
  onCreateComment: (htmlString: string) => string;
  onUpdateComment: (args: { entryKey: string; htmlString: string }) => boolean;
}

export const HighlightPageSectionComments: FunctionComponent<
  HighlightPageSectionCommentsProps
> = ({ today, comments, onCreateComment, onUpdateComment }) => {
  const todayComment = comments.find((comment) => comment.day.equals(today));

  const commentsNodes = comments
    .filter((comment) => !comment.day.equals(today))
    .map((comment) => {
      return (
        <div key={comment.id} className={styles["comment"]}>
          <CommentBlurb
            showHighlightTag={false}
            excerptProps={{ htmlString: comment.commentEntry.htmlString }}
            comment={{
              id: comment.id,
              day: comment.day,
              highlight: comment.highlight,
              commentEntry: comment.commentEntry,
            }}
          />
        </div>
      );
    });

  return (
    <div className={styles["page-section"]}>
      <div className={styles["today-comment"]}>
        <Type variant="serif" size="small">
          {today.toString("entry-printed-date")}
        </Type>
        <Entry
          htmlString={todayComment?.commentEntry?.htmlString}
          highlights={todayComment?.commentEntry?.highlights ?? []}
          editable
          maxLines={3}
          createEntry={onCreateComment}
          updateEntry={onUpdateComment}
        />
      </div>
      <div className={styles["past-comments"]}>{commentsNodes}</div>
    </div>
  );
};
