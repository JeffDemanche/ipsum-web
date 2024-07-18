import { Meta, StoryObj } from "@storybook/react";
import { IpsumDay } from "util/dates";

import { HighlightResultsOptionsDrawer } from "../HighlightResultsOptionsDrawer";

const meta: Meta<typeof HighlightResultsOptionsDrawer> = {
  title: "Organisms/HighlightResultsOptionsDrawer",
  component: HighlightResultsOptionsDrawer,
};

export default meta;
type StoryHighlightResultsOptionsDrawer = StoryObj<
  typeof HighlightResultsOptionsDrawer
>;

export const HighlightResultsOptionsDrawerExample: StoryHighlightResultsOptionsDrawer =
  {
    args: {
      defaultExpanded: true,
      sortDay: IpsumDay.today(),
      sortType: "Importance",
      relations: [
        {
          id: "1",
          predicate: "is",
          arc: {
            id: "1",
            hue: 0,
            name: "opinion",
          },
        },
        {
          id: "1",
          predicate: "relates to",
          arc: {
            id: "2",
            hue: 294,
            name: "bananas",
          },
        },
      ],
    },
  };
