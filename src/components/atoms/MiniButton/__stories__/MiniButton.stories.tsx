import { ErrorOutline } from "@mui/icons-material";
import type { Meta, StoryObj } from "@storybook/react";
import React from "react";

import { MiniButton } from "../MiniButton";

const meta: Meta<typeof MiniButton> = {
  title: "Atoms/MiniButton",
  component: MiniButton,
};

export default meta;
type Story = StoryObj<typeof MiniButton>;

export const MiniButtonExample: Story = {
  args: {
    children: <ErrorOutline fontSize="small" />,
  },
};
