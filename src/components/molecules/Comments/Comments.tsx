import cx from "classnames";
import React, { useState } from "react";
import { IpsumDay } from "util/dates";

import { Entry } from "../Entry";
import { MonthlyNav } from "../MonthlyNav";
import styles from "./Comments.less";

interface CommentsProps {
  className?: string;

  today: IpsumDay;
  comments: {
    id: string;
    day: IpsumDay;
    commentEntry: {
      entryKey: string;
      highlights: React.ComponentProps<typeof Entry>["highlights"];
      htmlString: string;
    };
  }[];

  onCreateComment: (htmlString: string) => string;
  onUpdateComment: (args: { entryKey: string; htmlString: string }) => boolean;
  onDeleteComment: (entryKey: string) => void;

  onCreateHighlight: () => string;
  onDeleteHighlight: (highlightId: string) => void;
  onHighlightClick: (highlightId: string) => void;
}

export const Comments: React.FunctionComponent<CommentsProps> = ({
  className,
  today,
  comments,
  onCreateComment,
  onUpdateComment,
  onDeleteComment,
  onCreateHighlight,
  onDeleteHighlight,
  onHighlightClick,
}) => {
  const [selectedDay, setSelectedDay] = useState(today);

  const yesterday = today.add(-1);

  const editable = today.equals(selectedDay) || yesterday.equals(selectedDay);

  const selectedComment = comments.find((comment) =>
    comment.day.equals(selectedDay)
  );

  const entryDays = comments.map((comment) => comment.day);

  const onSelectDay = (day: IpsumDay) => {
    setSelectedDay(day);
  };

  return (
    <div className={cx(className, styles["comments"])}>
      <MonthlyNav
        entryDays={entryDays}
        today={today}
        selectedDay={selectedDay}
        onDaySelect={onSelectDay}
      />
      {selectedComment && (
        <Entry
          entryKey={selectedComment.commentEntry.entryKey}
          entryDay={selectedDay}
          editable={editable}
          highlights={selectedComment.commentEntry.highlights}
          htmlString={selectedComment.commentEntry.htmlString}
          createEntry={onCreateComment}
          deleteEntry={onDeleteComment}
          updateEntry={onUpdateComment}
          createHighlight={onCreateHighlight}
          deleteHighlight={onDeleteHighlight}
          onHighlightClick={onHighlightClick}
        />
      )}
    </div>
  );
};
