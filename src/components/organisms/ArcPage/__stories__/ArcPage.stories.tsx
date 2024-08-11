import { Meta, StoryObj } from "@storybook/react";

import { ArcPage } from "../ArcPage";

const meta: Meta<typeof ArcPage> = {
  title: "Organisms/ArcPage",
  component: ArcPage,
};

export default meta;
type StoryArcPage = StoryObj<typeof ArcPage>;

export const ArcPageExample: StoryArcPage = {
  args: {
    arc: {
      hue: 120,
      name: "Arc 1",
    },
    expanded: true,
    onCollapse: () => {},
    onExpand: () => {},
  },
};
