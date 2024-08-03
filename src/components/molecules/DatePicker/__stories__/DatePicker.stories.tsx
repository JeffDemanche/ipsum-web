import { Meta, StoryObj } from "@storybook/react";
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
    layout: "fullscreen",
    query: {},
  },
  args: {
    selectedDay: IpsumDay.fromString("1/1/2024", "entry-printed-date"),
    entryOnDay: (day: IpsumDay) => {
      return ["1/2/2024", "1/5/2024", "1/17/2024"].includes(
        day.toString("entry-printed-date")
      );
    },
  },
};
