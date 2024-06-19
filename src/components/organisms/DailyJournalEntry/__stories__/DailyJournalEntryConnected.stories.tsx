import { ApolloProvider } from "@apollo/client";
import type { Meta, StoryObj } from "@storybook/react";
import { mockSiddhartha } from "mocks/siddhartha/siddhartha";
import React from "react";
import { client } from "util/apollo";
import { initializeState } from "util/apollo/client";
import { IpsumDay } from "util/dates";

import { DailyJournalEntryConnected } from "../DailyJournalEntryConnected";

const meta: Meta<typeof DailyJournalEntryConnected> = {
  title: "Organisms/DailyJournalEntry/DailyJournalEntryConnected",
  component: DailyJournalEntryConnected,
};

export default meta;
type StoryDailyJournalEntryConnected = StoryObj<
  typeof DailyJournalEntryConnected
>;

export const DailyJournalEntryConnectedExample: StoryDailyJournalEntryConnected =
  {
    beforeEach: async () => {
      await initializeState();
      mockSiddhartha();
    },
    args: {
      entryDay: IpsumDay.fromString("1/1/2020", "entry-printed-date"),
    },
    decorators: [
      (Story) => (
        <ApolloProvider client={client}>
          <Story />
        </ApolloProvider>
      ),
    ],
  };
