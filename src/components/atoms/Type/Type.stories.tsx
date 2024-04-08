import type { Meta, StoryObj } from "@storybook/react";
import { Type } from "./Type";

const meta: Meta<typeof Type> = {
  title: "Atoms/Type",
  component: Type,
};

export default meta;
type Story = StoryObj<typeof Type>;

export const TypeExampleSingleLine: Story = {
  args: {
    variant: "heading",
    weight: "regular",
    children: "The quick brown fox jumps over the lazy dog",
  },
};
