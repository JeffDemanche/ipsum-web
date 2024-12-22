import type { Meta, StoryObj } from "@storybook/react";
import { IpsumDay } from "util/dates";

import { CommentsNavigator } from "../CommentsNavigator";

const meta: Meta<typeof CommentsNavigator> = {
  title: "Molecules/Comments",
  component: CommentsNavigator,
};

export default meta;
type StoryComments = StoryObj<typeof CommentsNavigator>;

export const CommentsExample: StoryComments = {
  args: {
    today: IpsumDay.fromString("1/1/2020"),
    comments: [
      {
        id: "comment1",
        day: IpsumDay.fromString("1/1/2020"),
        htmlString: "Comment 1",
        commentEntry: {
          entryKey: "comment-entry:comment1",
          htmlString: "<p>Comment 1</p>",
          highlights: [],
        },
      },
      {
        id: "comment2",
        day: IpsumDay.fromString("12/14/2019"),
        htmlString:
          "In the days to come, I shall continue to walk this path of self-discovery and enlightenment, guided by the timeless wisdom of the Samanas. Though the road may be long and arduous, I am filled with a sense of purpose and determination, knowing that each step brings me closer to the ultimate truth.",
        commentEntry: {
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
  },
};
