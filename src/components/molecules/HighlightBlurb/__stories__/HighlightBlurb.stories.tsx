import type { Meta, StoryObj } from "@storybook/react";

import { HighlightBlurb } from "../HighlightBlurb";

const meta: Meta<typeof HighlightBlurb> = {
  title: "Molecules/HighlightBlurb",
  component: HighlightBlurb,
};

export default meta;
type Story = StoryObj<typeof HighlightBlurb>;

export const HighlightBlurbExample: Story = {
  args: {
    highlightTagProps: {
      highlightNumber: 1,
      objectText: "1/2/2024",
      hue: 90,
      arcNames: ["arc1", "arc2", "arc3"],
    },
    relations: [
      {
        id: "1",
        predicate: "is",
        arc: {
          id: "1",
          hue: 0,
          name: "arc1",
        },
      },
      {
        id: "2",
        predicate: "relates",
        arc: {
          id: "2",
          hue: 0,
          name: "arc2",
        },
      },
      {
        id: "3",
        predicate: "relates",
        arc: {
          id: "3",
          hue: 0,
          name: "arc3",
        },
      },
    ],
  },
};
