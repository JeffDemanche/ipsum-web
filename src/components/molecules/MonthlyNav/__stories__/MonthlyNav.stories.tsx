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
    entryDays: [],
    selectedDay: IpsumDay.today(),
    today: IpsumDay.today(),
  },
};

export const MonthlyNavWithEntries: Story = {
  args: {
    entryDays: [
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

      new IpsumDay(2, 6, 2024),
      new IpsumDay(3, 6, 2024),
      new IpsumDay(4, 6, 2024),
      new IpsumDay(5, 6, 2024),
      new IpsumDay(6, 6, 2024),
      new IpsumDay(8, 6, 2024),
      new IpsumDay(9, 6, 2024),
      new IpsumDay(11, 6, 2024),
      new IpsumDay(13, 6, 2024),
      new IpsumDay(14, 6, 2024),
      new IpsumDay(16, 6, 2024),
      new IpsumDay(19, 6, 2024),
      new IpsumDay(22, 6, 2024),
      new IpsumDay(24, 6, 2024),
      new IpsumDay(25, 6, 2024),
      new IpsumDay(27, 6, 2024),
      new IpsumDay(30, 6, 2024),
    ],
    selectedDay: new IpsumDay(7, 5, 2024),
    today: new IpsumDay(30, 6, 2024),
  },
};
