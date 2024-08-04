import type { Meta, StoryObj } from "@storybook/react";

import { PersistentTextField } from "../PersistentTextField";

const meta: Meta<typeof PersistentTextField> = {
  title: "Atoms/PersistentTextField",
  component: PersistentTextField,
};

export default meta;
type Story = StoryObj<typeof PersistentTextField>;

export const PersistentTextFieldExample: Story = {
  args: {
    defaultValue: "Hello, World!",
  },
};
