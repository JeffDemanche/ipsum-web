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
    editMode: true,
    programText:
      'highlights (from "1" to "2" and which relate to "3") sorted by recent as of "1"',
  },
};
