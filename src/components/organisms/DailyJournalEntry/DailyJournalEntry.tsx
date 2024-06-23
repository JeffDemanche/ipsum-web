import { Type } from "components/atoms/Type";
import { CommentBlurb } from "components/molecules/CommentBlurb";
import { MonthlyNav } from "components/molecules/MonthlyNav";
import { PageHeaderDailyJournal } from "components/molecules/PageHeader";
import { Entry } from "components/organisms/Entry";
import React, { useMemo } from "react";
import { IpsumDay } from "util/dates";

interface DailyJournalEntryProps {
  today: IpsumDay;
  selectedDay: IpsumDay;
  entryDays: IpsumDay[];
  highlights: {
    highlightId: string;
    highlightNumber: number;
    hue: number;
    arcNames: string[];
  }[];
  comments: {
    id: string;
    day: IpsumDay;
    htmlString: string;
    highlight: {
      id: string;
      objectText: string;
      hue: number;
      highlightNumber: number;
      arcNames: string[];
    };
  }[];
  editable: boolean;
  htmlString?: string;
  createEntry: (htmlString: string) => string;
  deleteEntry: (entryKey: string) => void;
  updateEntry: ({
    entryKey,
    htmlString,
  }: {
    entryKey: string;
    htmlString: string;
  }) => boolean;
  createHighlight: () => string;
  onDaySelect: (day: IpsumDay) => void;
}

export const DailyJournalEntry: React.FunctionComponent<
  DailyJournalEntryProps
> = ({
  today,
  selectedDay,
  entryDays,
  highlights,
  comments,
  editable,
  htmlString,
  createEntry,
  deleteEntry,
  updateEntry,
  createHighlight,
  onDaySelect,
}) => {
  const commentsMarkup = useMemo(() => {
    if (!comments?.length) return null;

    return (
      <div>
        <Type>Comments</Type>
        {comments?.map((comment) => (
          <CommentBlurb
            key={comment.id}
            selected={false}
            onSelect={() => {}}
            defaultExpanded={false}
            onExpand={() => {}}
            onCollapse={() => {}}
            excerptProps={{
              htmlString: comment.htmlString,
            }}
            comment={comment}
          />
        ))}
      </div>
    );
  }, [comments]);

  return (
    <div>
      <PageHeaderDailyJournal day={selectedDay} />
      <MonthlyNav
        today={today}
        selectedDay={selectedDay}
        entryDays={entryDays}
        onDaySelect={onDaySelect}
      />
      <Entry
        entryDay={selectedDay}
        highlights={highlights}
        editable={editable}
        htmlString={htmlString}
        createEntry={createEntry}
        deleteEntry={deleteEntry}
        updateEntry={updateEntry}
        createHighlight={createHighlight}
      />
      {commentsMarkup}
    </div>
  );
};
