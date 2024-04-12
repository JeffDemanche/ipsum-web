import type { Meta, StoryObj } from "@storybook/react";
import { WithEditor } from "./WithEditor";

const meta: Meta<typeof WithEditor> = {
  title: "Molecules/FormattingControls",
  component: WithEditor,
};

export default meta;
type Story = StoryObj<typeof WithEditor>;

export const FormattingControlsExample: Story = {
  args: {},
};
