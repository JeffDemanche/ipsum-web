import { Collapse } from "@mui/material";
import { Entry } from "components/molecules/Entry";
import { MonthlyNav } from "components/molecules/MonthlyNav";
import { PageHeaderDailyJournal } from "components/molecules/PageHeader";
import React, { ComponentProps } from "react";
import { IpsumDay } from "util/dates";

import styles from "./DailyJournalEntry.less";

interface DailyJournalEntryProps {
  entryKey: string;
  headerProps: ComponentProps<typeof PageHeaderDailyJournal>;
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
  deleteHighlight: (highlightId: string) => void;
  onDaySelect: (day: IpsumDay) => void;

  onHighlightClick?: (highlightId: string) => void;
}

export const DailyJournalEntry: React.FunctionComponent<
  DailyJournalEntryProps
> = ({
  headerProps,
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
  deleteHighlight,
  onDaySelect,
  onHighlightClick,
}) => {
  return (
    <div className={styles["daily-journal-page"]}>
      <PageHeaderDailyJournal {...headerProps} />
      <Collapse in={headerProps.expanded} orientation="vertical">
        <div className={styles["daily-journal-page-content"]}>
          <MonthlyNav
            today={today}
            selectedDay={selectedDay}
            entryDays={entryDays}
            onDaySelect={onDaySelect}
          />
          <Entry
            entryKey={selectedDay.toString("stored-day")}
            entryDay={selectedDay}
            highlights={highlights}
            editable={editable}
            htmlString={htmlString}
            createEntry={createEntry}
            deleteEntry={deleteEntry}
            updateEntry={updateEntry}
            createHighlight={createHighlight}
            deleteHighlight={deleteHighlight}
            onHighlightClick={onHighlightClick}
          />
        </div>
      </Collapse>
    </div>
  );
};
