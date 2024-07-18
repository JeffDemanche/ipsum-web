import { Meta, StoryObj } from "@storybook/react";
import { mockSiddhartha } from "mocks/siddhartha/siddhartha";
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
    sort: {
      onSortDayChange: () => {},
      onSortTypeChange: () => {},
      sortDay: IpsumDay.today(),
      sortType: "Importance",
    },
    filters: {
      relations: [
        {
          id: "1",
          predicate: "is",
          arc: { id: "arc1", hue: 0, name: "opinion" },
        },
      ],
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
            id: "1",
            predicate: "is",
            arc: { id: "arc1", hue: 0, name: "opinion" },
          },
        ],
      },
    ],
  },
};
