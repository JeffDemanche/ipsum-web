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
      expanded: true,
      sortDay: IpsumDay.today(),
      sortType: "Importance",
    },
  };
