import type { Meta, StoryObj } from "@storybook/react";
import { IpsumDay } from "util/dates";

import { DailyJournalEntryComments } from "../DailyJournalEntryComments";

const meta: Meta<typeof DailyJournalEntryComments> = {
  title: "Organisms/DailyJournalEntryComments",
  component: DailyJournalEntryComments,
};

export default meta;
type StoryDailyJournalEntryComments = StoryObj<
  typeof DailyJournalEntryComments
>;

export const DailyJournalEntryCommentsExample: StoryDailyJournalEntryComments =
  {
    args: {
      today: IpsumDay.fromString("1/7/2024"),
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
            object: { __typename: "Day", day: "1/2/2024" },
          },
          commentEntry: {
            highlights: [],
            htmlString:
              "<p>Lorem ipsum dolor sit amet.</p><p>Consectetur adipiscing elit.</p><p>Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>",
          },
        },
      ],
    },
  };
