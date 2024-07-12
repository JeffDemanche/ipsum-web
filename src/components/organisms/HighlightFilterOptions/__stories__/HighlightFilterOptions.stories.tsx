import { Meta, StoryObj } from "@storybook/react";

import { HighlightFilterOptions } from "../HighlightFilterOptions";

const meta: Meta<typeof HighlightFilterOptions> = {
  title: "Organisms/HighlightFilterOptions",
  component: HighlightFilterOptions,
};

export default meta;
type Story = StoryObj<typeof HighlightFilterOptions>;

export const HighlightFilterOptionsExample: Story = {
  args: {
    expanded: true,
    relations: [
      {
        id: "1",
        predicate: "is",
        arc: {
          id: "1",
          hue: 0,
          name: "opinion",
        },
      },
      {
        id: "1",
        predicate: "relates to",
        arc: {
          id: "2",
          hue: 294,
          name: "bananas",
        },
      },
    ],
  },
};
