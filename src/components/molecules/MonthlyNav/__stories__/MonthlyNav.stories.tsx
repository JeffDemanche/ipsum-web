import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { IpsumDay } from "util/dates";

import { MonthlyNav } from "../MonthlyNav";

const meta: Meta<typeof MonthlyNav> = {
  title: "Molecules/MonthlyNav",
  component: MonthlyNav,
  decorators: [
    (Story) => (
      <div style={{ width: "700px" }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof MonthlyNav>;

export const MonthlyNavWithNoEntries: Story = {
  args: {
    entryDates: [],
    selectedDay: IpsumDay.today(),
    today: IpsumDay.today(),
  },
};

export const MonthlyNavWithEntries: Story = {
  args: {
    entryDates: [
      new IpsumDay(2, 4, 2024),
      new IpsumDay(6, 4, 2024),
      new IpsumDay(8, 4, 2024),
      new IpsumDay(9, 4, 2024),
      new IpsumDay(19, 4, 2024),
      new IpsumDay(22, 4, 2024),
      new IpsumDay(24, 4, 2024),

      new IpsumDay(1, 5, 2024),
      new IpsumDay(7, 5, 2024),
      new IpsumDay(8, 5, 2024),
      new IpsumDay(12, 5, 2024),
    ],
    selectedDay: undefined,
    today: new IpsumDay(14, 5, 2024),
  },
};
