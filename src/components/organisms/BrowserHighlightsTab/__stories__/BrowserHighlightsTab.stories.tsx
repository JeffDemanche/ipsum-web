import type { Meta, StoryObj } from "@storybook/react";

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
  args: {},
};
