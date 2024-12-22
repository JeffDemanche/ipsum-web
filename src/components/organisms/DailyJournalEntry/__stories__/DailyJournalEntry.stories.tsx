import type { Meta, StoryObj } from "@storybook/react";
import { IpsumDay } from "util/dates";

import { DailyJournalEntry } from "../DailyJournalEntry";

const meta: Meta<typeof DailyJournalEntry> = {
  title: "Organisms/DailyJournalEntry",
  component: DailyJournalEntry,
};

export default meta;
type StoryDailyJournalEntry = StoryObj<typeof DailyJournalEntry>;

export const DailyJournalEntryExample: StoryDailyJournalEntry = {
  args: {
    entryKey: "1/7/2024",
    selectedDay: IpsumDay.fromString("1/7/2024"),
    today: IpsumDay.fromString("1/7/2024"),
    highlights: [],
    entryDays: [],
    editable: true,
    headerProps: {
      day: IpsumDay.fromString("1/7/2024"),
      expanded: true,
    },
    dailyJournalEntryCommentsConnectedProps: {
      comments: [],
      onCreateCommentEntry: () => "",
      onDeleteCommentEntry: () => {},
      onCreateCommentHighlight: () => "",
      onDeleteCommentHighlight: () => {},
      onUpdateCommentEntry: () => true,
      today: IpsumDay.fromString("1/7/2024", "entry-printed-date"),
    },
  },
};
