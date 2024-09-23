import type { Meta, StoryObj } from "@storybook/react";
import { constructExcerpt } from "mocks/excerpts";
import { mockSiddhartha } from "mocks/siddhartha/siddhartha";
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

const siddharthaMock = mockSiddhartha();
const highlights = siddharthaMock.projectState
  .collection("highlights")
  .getAll();
const entries = siddharthaMock.projectState.collection("entries").getAll();

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
      importanceRating: 0,
    },
    excerptProps: {
      htmlString: constructExcerpt({
        excerptPieces: [
          {
            blockType: "paragraph",
            innerHtml:
              "I have spent the day in deep conversation with my friend Govinda, discussing the teachings of our revered teacher, the illustrious Gotama. His words have left an indelible mark upon my consciousness, stirring within me a longing to embark on a journey of self-discovery and enlightenment.",
            highlight: { id: "highlight-2", hue: 90 },
          },
          {
            blockType: "paragraph",
            innerHtml:
              "As I gaze upon the tranquil waters of the river, I cannot help but feel a sense of restlessness stirring within me. The life of luxury and privilege that surrounds me in my father's home no longer holds the allure it once did. The path to true enlightenment lies beyond the confines of material wealth and societal expectations.",
            highlight: { id: "highlight-2", hue: 90 },
          },
        ],
      }),
      maxLines: undefined,
    },
    relations: [
      {
        predicate: "is",
        arc: {
          id: "1",
          hue: 0,
          name: "arc1",
        },
      },
      {
        predicate: "relates",
        arc: {
          id: "2",
          hue: 90,
          name: "arc2",
        },
      },
      {
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
