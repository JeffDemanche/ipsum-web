import type { Meta, StoryObj } from "@storybook/react";

import { ArcTag } from "../ArcTag";

const meta: Meta<typeof ArcTag> = {
  title: "Molecules/ArcTag",
  component: ArcTag,
};

export default meta;
type Story = StoryObj<typeof ArcTag>;

export const ArcTagExample: Story = {
  args: {
    showAlias: true,
    showEdit: true,
    showDelete: true,
    text: "Tag",
    hue: 0,
    onDelete: () => {},
  },
};
