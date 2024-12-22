import type { Meta, StoryObj } from "@storybook/react";
import { IpsumDay } from "util/dates";

import { DatePicker } from "..";

const meta: Meta<typeof DatePicker> = {
  title: "Molecules/DatePicker",
  component: DatePicker,
};

export default meta;
type StoryDatePicker = StoryObj<typeof DatePicker>;

export const DatePickerExample: StoryDatePicker = {
  parameters: {
    query: {},
  },
  args: {
    showButtonOptions: true,
    buttonOptions: [
      { label: "1 month", day: IpsumDay.today().add(0, -1) },
      { label: "6 months", day: IpsumDay.today().add(0, -6) },
      { label: "1 year", day: IpsumDay.today().add(0, -12) },
    ],
    selectedDay: IpsumDay.fromString("1/1/2024", "entry-printed-date"),
    dataOnDay: (day: IpsumDay) => {
      switch (day.toString("entry-printed-date")) {
        case "1/2/2024":
          return {
            entry: true,
            arcs: [
              { name: "Arc 1", hue: 0 },
              { name: "Arc 2", hue: 120 },
            ],
          };
        case "1/5/2024":
          return {
            entry: true,
            arcs: [{ name: "Arc 3", hue: 240 }],
          };
        case "1/17/2024":
          return {
            entry: true,
            arcs: [{ name: "Arc 4", hue: 300 }],
          };
        default:
          return undefined;
      }
    },
  },
};
