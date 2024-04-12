import type { Meta, StoryObj } from "@storybook/react";
import { ToggleButton } from "./ToggleButton";
import React from "react";

const WithState: React.FunctionComponent = () => {
  const [selected, setSelected] = React.useState(false);

  return (
    <ToggleButton
      value={"check"}
      selected={selected}
      onClick={() => {
        setSelected(!selected);
      }}
    >
      Toggle Button
    </ToggleButton>
  );
};

const meta: Meta<typeof WithState> = {
  title: "Atoms/ToggleButton",
  component: WithState,
};

export default meta;
type Story = StoryObj<typeof WithState>;

export const ToggleButtonExample: Story = {
  args: {
    children: "Toggle Button",
  },
};
