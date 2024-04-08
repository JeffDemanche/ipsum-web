import type { Meta, StoryObj } from "@storybook/react";
import { BlurbWrapper } from "./BlurbWrapper";

const meta: Meta<typeof BlurbWrapper> = {
  title: "Atoms/BlurbWrapper",
  component: BlurbWrapper,
};

export default meta;
type Story = StoryObj<typeof BlurbWrapper>;

export const BlurbWrapperExample: Story = {
  args: {
    children: "The quick brown fox jumps over the lazy dog",
  },
};
