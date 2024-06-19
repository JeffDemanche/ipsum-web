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
    selectedDay: IpsumDay.today(),
    today: IpsumDay.today(),
    highlights: [],
    entryDays: [],
    editable: true,
  },
};
