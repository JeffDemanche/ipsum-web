import type { Meta, StoryObj } from "@storybook/react";
import { IpsumDay } from "util/dates";

import { HighlightTag } from "../HighlightTag";

const meta: Meta<typeof HighlightTag> = {
  title: "Molecules/HighlightTag",
  component: HighlightTag,
};

export default meta;
type Story = StoryObj<typeof HighlightTag>;

export const HighlightTagWithDay: Story = {
  args: {
    hue: 0,
    objectText: IpsumDay.today().toString("entry-printed-date"),
    arcNames: ["attachment", "illusion"],
    highlightNumber: 1,
  },
};

export const HighlightTagWithoutDay: Story = {
  args: {
    hue: 0,
    arcNames: ["attachment", "illusion"],
    highlightNumber: 1,
  },
};

export const HighlightTagWithoutArcs: Story = {
  args: {
    hue: 0,
    objectText: IpsumDay.today().toString("entry-printed-date"),
    highlightNumber: 1,
  },
};
