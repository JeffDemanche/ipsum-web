import type { Meta, StoryObj } from "@storybook/react";
import { mockSiddhartha } from "mocks/siddhartha/siddhartha";
import React from "react";
import { IpsumDay } from "util/dates";
import { IpsumStateProvider } from "util/state/IpsumStateContext";

import { DailyJournalEntryConnected } from "../DailyJournalEntryConnected";

const meta: Meta<typeof DailyJournalEntryConnected> = {
  title: "Organisms/DailyJournalEntry",
  component: DailyJournalEntryConnected,
};

export default meta;
type StoryDailyJournalEntryConnected = StoryObj<
  typeof DailyJournalEntryConnected
>;

export const DailyJournalEntryConnectedExample: StoryDailyJournalEntryConnected =
  {
    args: {
      entryDay: IpsumDay.fromString("3/4/2020", "entry-printed-date"),
    },
    decorators: [
      (Story) => (
        <IpsumStateProvider projectState={mockSiddhartha().projectState}>
          <Story />
        </IpsumStateProvider>
      ),
    ],
  };
