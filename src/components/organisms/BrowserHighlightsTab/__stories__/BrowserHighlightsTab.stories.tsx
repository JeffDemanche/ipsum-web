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
                  id: "1",
                  predicate: "is",
                  arc: {
                    id: "1",
                    hue: 124,
                    name: "arc1",
                  },
                },
                {
                  id: "2",
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
                  id: "3",
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
  },
};
