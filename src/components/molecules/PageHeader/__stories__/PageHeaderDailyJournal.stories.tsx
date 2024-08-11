import { Meta, StoryObj } from "@storybook/react";
import { IpsumDay } from "util/dates";

import { PageHeaderDailyJournal } from "../PageHeaderDailyJournal";

const meta: Meta<typeof PageHeaderDailyJournal> = {
  title: "Molecules/PageHeader/DailyJournal",
  component: PageHeaderDailyJournal,
};

export default meta;
type StoryDailyJournal = StoryObj<typeof PageHeaderDailyJournal>;

export const PageHeaderDailyJournalExample: StoryDailyJournal = {
  args: {
    day: IpsumDay.today(),
    expanded: true,
  },
};
