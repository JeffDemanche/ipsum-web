import { MonthlyNav } from "components/molecules/MonthlyNav";
import { PageHeaderDailyJournal } from "components/molecules/PageHeader";
import { Entry } from "components/organisms/Entry";
import React from "react";
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
  editable,
  htmlString,
  createEntry,
  deleteEntry,
  updateEntry,
  createHighlight,
  onDaySelect,
}) => {
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
    </div>
  );
};
