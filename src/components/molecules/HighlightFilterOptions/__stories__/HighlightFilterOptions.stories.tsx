import { Meta, StoryObj } from "@storybook/react";

import { HighlightFilterOptions } from "../HighlightFilterOptions";

const meta: Meta<typeof HighlightFilterOptions> = {
  title: "Molecules/HighlightFilterOptions",
  component: HighlightFilterOptions,
};

export default meta;
type Story = StoryObj<typeof HighlightFilterOptions>;

export const HighlightFilterOptionsExample: Story = {
  args: {
    expanded: true,
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
};
