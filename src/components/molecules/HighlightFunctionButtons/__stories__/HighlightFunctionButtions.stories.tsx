import type { Meta, StoryObj } from "@storybook/react";
import React from "react";

import { HighlightFunctionButtons } from "../HighlightFunctionButtons";

const meta: Meta<typeof HighlightFunctionButtons> = {
  title: "Molecules/HighlightFunctionButtons",
  component: HighlightFunctionButtons,
  decorators: [
    (story) => {
      return <div style={{ width: "500px" }}>{story()}</div>;
    },
  ],
};

export default meta;
type Story = StoryObj<typeof HighlightFunctionButtons>;

export const HighlightFunctionButtonsExample: Story = {
  parameters: {
    width: "400px",
  },
  args: {
    orientation: "horizontal",
    highlightHue: 90,
    notificationState: { type: "Up for review" },
    onDelete: () => {},
  },
};
