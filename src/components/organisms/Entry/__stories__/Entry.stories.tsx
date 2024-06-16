import type { Meta, StoryObj } from "@storybook/react";
import { IpsumDay } from "util/dates";

import { Entry } from "../Entry";

const meta: Meta<typeof Entry> = {
  title: "Organisms/Entry",
  component: Entry,
};

export default meta;
type Story = StoryObj<typeof Entry>;

export const EntryExample: Story = {
  args: {
    entryDay: new IpsumDay(1, 0, 2021),
    highlights: [
      {
        highlightNumber: 1,
        highlightId: "1",
        hue: 0,
        arcNames: ["Arc 1"],
      },
    ],
    editable: true,
    htmlString: "<p>Entry content</p>",
  },
};
