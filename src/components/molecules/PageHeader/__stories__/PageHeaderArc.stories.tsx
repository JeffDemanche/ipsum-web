import type { Meta, StoryObj } from "@storybook/react";

import { PageHeaderArc } from "../PageHeaderArc";

const meta: Meta<typeof PageHeaderArc> = {
  title: "Molecules/PageHeader",
  component: PageHeaderArc,
};

export default meta;
type StoryDailyJournal = StoryObj<typeof PageHeaderArc>;

export const PageHeaderArcExample: StoryDailyJournal = {
  args: {
    arc: {
      hue: 0,
      name: "attachment ",
    },
    expanded: true,
  },
};
