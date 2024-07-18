import { Meta, StoryObj } from "@storybook/react";

import { BrowserDrawerConnected } from "../BrowserDrawerConnected";

const meta: Meta<typeof BrowserDrawerConnected> = {
  title: "Organisms/BrowserDrawer/BrowserDrawerConnected",
  component: BrowserDrawerConnected,
};

export default meta;
type StoryBrowserDrawerConnected = StoryObj<typeof BrowserDrawerConnected>;

export const BrowserDrawerConnectedExample: StoryBrowserDrawerConnected = {
  args: {},
};
