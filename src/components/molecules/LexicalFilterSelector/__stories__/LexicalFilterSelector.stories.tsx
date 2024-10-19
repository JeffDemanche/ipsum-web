import type { Meta, StoryObj } from "@storybook/react";

import { LexicalFilterSelector } from "../LexicalFilterSelector";

const meta: Meta<typeof LexicalFilterSelector> = {
  title: "Molecules/LexicalFilterSelector",
  component: LexicalFilterSelector,
};

export default meta;
type Story = StoryObj<typeof LexicalFilterSelector>;

export const LexicalFilterSelectorExample: Story = {
  args: {
    editMode: false,
  },
};
