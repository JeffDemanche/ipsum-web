import { Meta, StoryObj } from "@storybook/react";
import { IpsumDay } from "util/dates";

import { BrowserHighlightsTab } from "../BrowserHighlightsTab";

const meta: Meta<typeof BrowserHighlightsTab> = {
  title: "Organisms/BrowserHighlightsTab",
  component: BrowserHighlightsTab,
};

export default meta;
type Story = StoryObj<typeof BrowserHighlightsTab>;

export const BrowserHighlightsTabExample: Story = {
  parameters: {
    layout: "fullscreen",
  },
  args: {
    optionsDrawerProps: {
      defaultExpanded: true,
      sortDay: IpsumDay.today(),
      sortType: "Importance",
      onSortDayChange: () => {},
      onSortTypeChange: () => {},
      filterOptionsProps: {
        onCreateClause: () => {},
        dateFilterFrom: undefined,
        dateFilterTo: undefined,
        clauses: {
          and: [
            {
              orRelations: [
                {
                  predicate: "is",
                  arc: {
                    id: "1",
                    hue: 124,
                    name: "arc1",
                  },
                },
                {
                  predicate: "relates to",
                  arc: {
                    id: "2",
                    hue: 236,
                    name: "arc2",
                  },
                },
              ],
            },
            {
              orRelations: [
                {
                  predicate: "relates to",
                  arc: {
                    id: "3",
                    hue: 85,
                    name: "arc3",
                  },
                },
              ],
            },
          ],
        },
      },
    },
    highlights: [
      {
        day: IpsumDay.fromString("1/1/2024"),
        excerptProps: {
          htmlString: "<p>The quick brown fox jumps over the lazy dog.</p>",
        },
        highlightProps: {
          highlightId: "highlight-1",
          arcNames: ["arc1", "arc2", "arc3"],
          highlightNumber: 1,
          hue: 90,
          objectText: "1/1/2024",
        },
        relationsProps: [
          {
            predicate: "is",
            arc: { id: "arc1", hue: 0, name: "opinion" },
          },
        ],
        highlightObject: {
          type: "daily_journal",
          entryKey: "1/1/2024",
        },
      },
    ],
  },
};
