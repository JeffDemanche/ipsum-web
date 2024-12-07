import { Meta, StoryObj } from "@storybook/react";
import { IpsumDay } from "util/dates";

import { HighlightPage } from "../HighlightPage";

const meta: Meta<typeof HighlightPage> = {
  title: "Organisms/HighlightPage",
  component: HighlightPage,
};

export default meta;
type StoryHighlightPage = StoryObj<typeof HighlightPage>;

export const HighlightPageExample: StoryHighlightPage = {
  args: {
    expanded: true,
    highlight: {
      id: "highlight 1",
      htmlString: "<p>Highlight excerpt</p>",
      arcNames: ["arc 1", "arc 2"],
      highlightNumber: 1,
      hue: 120,
      objectText: "Object text",
      relations: [],
      comments: [
        {
          id: "comment1",
          day: IpsumDay.fromString("1/1/2020"),
          highlight: {
            id: "highlight1",
            arcNames: ["arc1"],
            hue: 120,
            highlightNumber: 1,
            objectText: "Object text",
          },
          commentEntry: {
            htmlString: "<p>Comment 1</p>",
            highlights: [],
          },
        },
        {
          id: "comment2",
          day: IpsumDay.fromString("12/14/2019"),
          highlight: {
            id: "highlight2",
            arcNames: ["arc2"],
            hue: 120,
            highlightNumber: 2,
            objectText: "Object text",
          },
          commentEntry: {
            htmlString:
              "<p>In the days to come, I shall continue to walk this path of self-discovery and enlightenment, guided by the timeless wisdom of the Samanas. Though the road may be long and arduous, I am filled with a sense of purpose and determination, knowing that each step brings me closer to the ultimate truth.</p>",
            highlights: [
              {
                arcNames: ["arc1"],
                highlightId: "highlight1",
                highlightNumber: 1,
                hue: 120,
              },
              {
                arcNames: ["arc2"],
                highlightId: "highlight2",
                highlightNumber: 1,
                hue: 240,
              },
            ],
          },
        },
        {
          id: "comment3",
          day: IpsumDay.fromString("12/13/2019"),
          highlight: {
            id: "highlight3",
            arcNames: ["arc3"],
            hue: 120,
            highlightNumber: 3,
            objectText: "Object text",
          },
          commentEntry: {
            htmlString:
              "<p>Tonight, under the enveloping darkness of the new moon, I find myself at a pivotal juncture in my journey. Govinda and I have joined the followers of Gotama, the Illustrious Buddha. The radiance of his presence, the tranquility of his being, and the profundity of his teachings have left an indelible mark upon my soul.</p>",
            highlights: [],
          },
        },
      ],
    },
    onCollapse: () => {},
    onExpand: () => {},
    commentsProps: {
      selectedDay: IpsumDay.fromString("1/1/2020"),
      setSelectedDay: () => {},
      today: IpsumDay.fromString("1/1/2020"),
      comments: [
        {
          id: "comment1",
          day: IpsumDay.fromString("1/1/2020"),
          sourceEntry: {
            entryKey: "comment-entry:comment1",
            htmlString: "<p>Comment 1</p>",
            highlights: [],
          },
        },
        {
          id: "comment2",
          day: IpsumDay.fromString("12/14/2019"),
          sourceEntry: {
            entryKey: "comment-entry:comment2",
            htmlString:
              "<p>In the days to come, I shall continue to walk this path of self-discovery and enlightenment, guided by the timeless wisdom of the Samanas. Though the road may be long and arduous, I am filled with a sense of purpose and determination, knowing that each step brings me closer to the ultimate truth.</p>",
            highlights: [],
          },
        },
      ],
      onCreateComment: (htmlString: string) => "new comment",
      onUpdateComment: ({
        entryKey,
        htmlString,
      }: {
        entryKey: string;
        htmlString: string;
      }) => true,
      onDeleteComment: (entryKey: string) => {},
      onCreateHighlight: () => "new highlight",
      onDeleteHighlight: (highlightId: string) => {},
      onHighlightClick: (highlightId: string) => {},
    },
  },
};
