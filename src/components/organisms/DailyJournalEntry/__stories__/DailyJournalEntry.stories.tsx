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
    comments: [
      {
        id: "1",
        day: IpsumDay.fromString("1/7/2024"),
        highlight: {
          id: "highlight-id",
          highlightNumber: 1,
          hue: 90,
          objectText: "1/2/2024",
          arcNames: ["sam"],
        },
        commentEntry: {
          htmlString:
            "<p>Lorem ipsum dolor sit amet.</p><p>Consectetur adipiscing elit.</p><p>Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>",
          highlights: [],
        },
      },
    ],
    entryDays: [],
    editable: true,
    headerProps: {
      day: IpsumDay.fromString("1/7/2024"),
      expanded: true,
    },
  },
};
