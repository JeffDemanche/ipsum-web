import { Collapse } from "@mui/material";
import { Entry } from "components/molecules/Entry";
import { MonthlyNav } from "components/molecules/MonthlyNav";
import { PageHeaderDailyJournal } from "components/molecules/PageHeader";
import type { ComponentProps } from "react";
import React from "react";
import type { IpsumDay } from "util/dates";
import { TestIds } from "util/test-ids";

import { DailyJournalEntryComments } from "../DailyJournalEntryComments";
import type { DailyJournalEntryCommentsConnectedProps } from "../DailyJournalEntryComments/use-daily-journal-entry-comments-connected";
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
  dailyJournalEntryCommentsConnectedProps: DailyJournalEntryCommentsConnectedProps;

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
  dailyJournalEntryCommentsConnectedProps,
  onHighlightClick,
}) => {
  return (
    <div
      data-testid={TestIds.DailyJournalEntry.DailyJournalEntry}
      className={styles["daily-journal-page"]}
    >
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
            editorNamespace={`daily-journal-${selectedDay.toString("stored-day")}`}
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
          {!!dailyJournalEntryCommentsConnectedProps.comments?.length && (
            <>
              <hr />
              <DailyJournalEntryComments
                {...dailyJournalEntryCommentsConnectedProps}
              />
            </>
          )}
        </div>
      </Collapse>
    </div>
  );
};
