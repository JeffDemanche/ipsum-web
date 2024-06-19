import type { Meta, StoryObj } from "@storybook/react";
import { constructExcerpt } from "mocks/excerpts";
import { siddhartha } from "mocks/siddhartha";
import React from "react";

import { HighlightBlurb } from "../HighlightBlurb";

const meta: Meta<typeof HighlightBlurb> = {
  title: "Molecules/HighlightBlurb",
  component: HighlightBlurb,
  decorators: [
    (story) => {
      return <div style={{ width: "500px" }}>{story()}</div>;
    },
  ],
};

export default meta;
type Story = StoryObj<typeof HighlightBlurb>;

export const HighlightBlurbExample: Story = {
  parameters: {
    width: "400px",
  },
  args: {
    highlightProps: {
      highlightId: "highlight-id",
      highlightNumber: 1,
      objectText: "1/2/2024",
      hue: 90,
      arcNames: ["arc1", "arc2", "arc3"],
    },
    excerptProps: {
      htmlString: constructExcerpt({
        excerptPieces: [
          {
            blockType: "paragraph",
            innerHtml: siddhartha.chapter1TheSonOfTheBrahman[1],
            highlight: { id: "highlight-id", hue: 90 },
          },
          {
            blockType: "paragraph",
            innerHtml: siddhartha.chapter1TheSonOfTheBrahman[2],
            highlight: { id: "highlight-id", hue: 90 },
          },
        ],
      }),
      maxLines: undefined,
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
          hue: 90,
          name: "arc2",
        },
      },
      {
        id: "3",
        predicate: "relates",
        arc: {
          id: "3",
          hue: 180,
          name: "arc3",
        },
      },
    ],
  },
};
