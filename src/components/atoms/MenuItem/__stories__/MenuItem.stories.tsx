import type { Meta, StoryObj } from "@storybook/react";

import { MenuItem } from "../MenuItem";

const meta: Meta<typeof MenuItem> = {
  title: "Atoms/MenuItem",
  component: MenuItem,
};

export default meta;
type Story = StoryObj<typeof MenuItem>;

export const MenuItemExample: Story = {
  args: {
    children: "Menu Item",
  },
};
