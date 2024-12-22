import type { Meta, StoryObj } from "@storybook/react";
import { mockSiddhartha } from "mocks/siddhartha/siddhartha";
import React from "react";
import { MemoryRouter } from "react-router";
import { IpsumDay } from "util/dates";
import { dataToSearchParams, IpsumStateProvider } from "util/state";

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
      layerIndex: 0,
      day: IpsumDay.fromString("03-04-2020", "url-format"),
    },
    decorators: [
      (Story) => {
        return (
          <MemoryRouter
            initialEntries={[
              `?${dataToSearchParams<"journal">({
                layers: [
                  {
                    type: "daily_journal",
                    day: "03-04-2020",
                    expanded: "false",
                  },
                ],
              })}`,
            ]}
          >
            <IpsumStateProvider projectState={mockSiddhartha().projectState}>
              <Story />
            </IpsumStateProvider>
          </MemoryRouter>
        );
      },
    ],
  };
