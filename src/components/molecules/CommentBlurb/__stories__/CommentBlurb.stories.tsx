import type { Meta, StoryObj } from "@storybook/react";
import { constructExcerpt } from "mocks/excerpts";
import { siddhartha } from "mocks/siddhartha";
import { IpsumDay } from "util/dates";

import { CommentBlurb } from "../CommentBlurb";

const meta: Meta<typeof CommentBlurb> = {
  title: "Molecules/CommentBlurb",
  component: CommentBlurb,
};

export default meta;
type StoryCommentBlurb = StoryObj<typeof CommentBlurb>;

export const CommentBlurbExample: StoryCommentBlurb = {
  args: {
    selected: false,
    defaultExpanded: false,
    comment: {
      id: "comment-id",
      day: IpsumDay.today(),
      highlight: {
        id: "highlight-id",
        hue: 90,
        highlightNumber: 1,
        objectText: "1/2/2024",
        arcNames: ["arc1", "arc2", "arc3"],
        object: { __typename: "Day", day: "1/2/2024" },
      },
      commentEntry: {
        highlights: [],
        htmlString: constructExcerpt({
          excerptPieces: [
            {
              blockType: "paragraph",
              innerHtml: siddhartha.journalEntry1_TheSonOfTheBrahman
                .sections[1] as string,
              highlight: { id: "highlight-id", hue: 90 },
            },
            {
              blockType: "paragraph",
              innerHtml: siddhartha.journalEntry1_TheSonOfTheBrahman
                .sections[2] as string,
              highlight: { id: "highlight-id", hue: 90 },
            },
          ],
        }),
      },
    },
  },
};
