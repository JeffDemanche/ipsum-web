import type { Meta, StoryObj } from "@storybook/react";
import React, { useState } from "react";

import { ToggleButton } from "../ToggleButton";

const WithState: React.FunctionComponent<{
  variant: "text" | "outlined";
  children: React.ReactNode;
}> = ({ variant, children }) => {
  const [selected, setSelected] = useState(false);

  return (
    <ToggleButton
      variant={variant}
      value={"check"}
      selected={selected}
      onClick={() => {
        setSelected(!selected);
      }}
    >
      {children}
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
    variant: "outlined",
    children: "Toggle Button",
  },
};
