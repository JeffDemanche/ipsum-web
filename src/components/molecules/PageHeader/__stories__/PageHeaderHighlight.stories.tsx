import type { Meta, StoryObj } from "@storybook/react";

import { PageHeaderHighlight } from "../PageHeaderHighlight";

const meta: Meta<typeof PageHeaderHighlight> = {
  title: "Molecules/PageHeader",
  component: PageHeaderHighlight,
};

export default meta;
type StoryDailyJournal = StoryObj<typeof PageHeaderHighlight>;

export const PageHeaderHighlightExample: StoryDailyJournal = {
  args: {
    highlight: {
      arcNames: ["arc 1", "arc 2"],
      highlightNumber: 1,
      hue: 120,
      objectText: "Object Text",
    },
    expanded: true,
  },
};
