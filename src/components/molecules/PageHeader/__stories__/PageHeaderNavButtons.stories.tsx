import type { Meta, StoryObj } from "@storybook/react";

import { PageHeaderNavButtons } from "../PageHeaderNavButtons";

const meta: Meta<typeof PageHeaderNavButtons> = {
  title: "Molecules/PageHeader",
  component: PageHeaderNavButtons,
};

export default meta;
type StoryDailyJournal = StoryObj<typeof PageHeaderNavButtons>;

export const PageHeaderNavButtonsExample: StoryDailyJournal = {
  args: {
    showExpand: true,
    showCollapse: false,
    showClose: true,
    hue: 0,
    onLightBackground: true,
  },
};
