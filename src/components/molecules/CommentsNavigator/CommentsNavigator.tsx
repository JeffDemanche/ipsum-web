import cx from "classnames";
import React from "react";
import type { IpsumDay } from "util/dates";
import { TestIds } from "util/test-ids";

import { Entry } from "../Entry";
import { MonthlyNav } from "../MonthlyNav";
import styles from "./CommentsNavigator.less";

interface CommentsNavigatorProps {
  className?: string;

  today: IpsumDay;
  selectedDay: IpsumDay;
  setSelectedDay: (day: IpsumDay) => void;

  comments: {
    id: string;
    day: IpsumDay;
    commentEntry: {
      entryKey: string;
      highlights: React.ComponentProps<typeof Entry>["highlights"];
      htmlString: string;
    };
    htmlString: string;
  }[];

  onCreateComment: (htmlString: string) => string;
  onUpdateComment: (args: { entryKey: string; htmlString: string }) => boolean;
  onDeleteComment: (entryKey: string) => void;

  onCreateHighlight: () => string;
  onDeleteHighlight: (highlightId: string) => void;
  onHighlightClick: (highlightId: string) => void;
}

export const CommentsNavigator: React.FunctionComponent<
  CommentsNavigatorProps
> = ({
  className,
  today,
  selectedDay,
  setSelectedDay,
  comments,
  onCreateComment,
  onUpdateComment,
  onDeleteComment,
  onCreateHighlight,
  onDeleteHighlight,
  onHighlightClick,
}) => {
  const yesterday = today.add(-1);

  const editable = today.equals(selectedDay) || yesterday.equals(selectedDay);

  const selectedComment = comments.find((comment) =>
    comment.day.equals(selectedDay)
  );

  const isNew = !selectedComment;

  const entryKey = isNew ? undefined : `comment-entry:${selectedComment.id}`;

  const highlights = isNew ? [] : selectedComment.commentEntry.highlights;

  const htmlString = isNew ? "" : selectedComment.commentEntry.htmlString;

  const entryDays = comments.map((comment) => comment.day);

  const onSelectDay = (day: IpsumDay) => {
    setSelectedDay(day);
  };

  return (
    <div
      data-testid={TestIds.Comments.Comments}
      className={cx(className, styles["comments"])}
    >
      <MonthlyNav
        entryDays={entryDays}
        today={today}
        selectedDay={selectedDay}
        onDaySelect={onSelectDay}
      />
      <Entry
        editorNamespace={entryKey}
        entryKey={entryKey}
        entryDay={selectedDay}
        editable={editable}
        highlights={highlights}
        htmlString={htmlString}
        createEntry={onCreateComment}
        deleteEntry={onDeleteComment}
        updateEntry={onUpdateComment}
        createHighlight={onCreateHighlight}
        deleteHighlight={onDeleteHighlight}
        onHighlightClick={onHighlightClick}
      />
    </div>
  );
};
