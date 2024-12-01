import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { IpsumDay } from "util/dates";

import { HighlightSRSButtons } from "../HighlightSRSButtons";

const meta: Meta<typeof HighlightSRSButtons> = {
  title: "Molecules/HighlightSRSButtons",
  component: HighlightSRSButtons,
  decorators: [
    (story) => {
      return <div style={{ width: "500px" }}>{story()}</div>;
    },
  ],
};

export default meta;
type Story = StoryObj<typeof HighlightSRSButtons>;

export const HighlightSRSButtonsExample: Story = {
  parameters: {
    width: "400px",
  },
  args: {
    orientation: "horizontal",
    today: IpsumDay.fromString("1/1/2024", "entry-printed-date"),
    prospectiveIntervals: [0, 1, 2, 3, 4, 5],
    reviewState: { type: "reviewed", rating: 5 },
    onRate: (q: number) => console.log(q),
    onStartSRS: () => console.log("start SRS"),
  },
};
