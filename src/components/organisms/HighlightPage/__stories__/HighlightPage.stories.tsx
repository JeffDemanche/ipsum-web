import { Meta, StoryObj } from "@storybook/react";

import { HighlightPage } from "../HighlightPage";

const meta: Meta<typeof HighlightPage> = {
  title: "Organisms/HighlightPage",
  component: HighlightPage,
};

export default meta;
type StoryHighlightPage = StoryObj<typeof HighlightPage>;

export const HighlightPageExample: StoryHighlightPage = {
  args: {
    expanded: true,
    highlight: {
      id: "highlight 1",
      htmlString: "<p>Highlight excerpt</p>",
      arcNames: ["arc 1", "arc 2"],
      highlightNumber: 1,
      hue: 120,
      objectText: "Object text",
      relations: [],
    },
    onCollapse: () => {},
    onExpand: () => {},
  },
};