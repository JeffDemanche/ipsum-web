import type { Meta, StoryObj } from "@storybook/react";

import { TextField } from "../TextField";

const meta: Meta<typeof TextField> = {
  title: "Atoms/TextField",
  component: TextField,
};

export default meta;
type Story = StoryObj<typeof TextField>;

export const TextFieldExample: Story = {
  args: {
    defaultValue: "Hello, World!",
    variant: "outlined",
  },
};
