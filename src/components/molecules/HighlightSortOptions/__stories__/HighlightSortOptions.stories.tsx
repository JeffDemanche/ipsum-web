import { Meta, StoryObj } from "@storybook/react";

import { HighlightSortOptions } from "../HighlightSortOptions";

const meta: Meta<typeof HighlightSortOptions> = {
  title: "Molecules/HighlightSortOptions",
  component: HighlightSortOptions,
};

export default meta;
type Story = StoryObj<typeof HighlightSortOptions>;

export const HighlightSortOptionsExample: Story = {
  args: {
    expanded: true,
    sortType: "Importance",
  },
};
