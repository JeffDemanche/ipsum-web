import { Meta, StoryObj } from "@storybook/react";
import { mockSiddhartha } from "mocks/siddhartha/siddhartha";
import React from "react";
import { MemoryRouter } from "react-router";
import { IpsumStateProvider } from "util/state";

import { BrowserDrawerConnected } from "../BrowserDrawerConnected";

const meta: Meta<typeof BrowserDrawerConnected> = {
  title: "Organisms/BrowserDrawer",
  component: BrowserDrawerConnected,
};

export default meta;
type StoryBrowserDrawerConnected = StoryObj<typeof BrowserDrawerConnected>;

export const BrowserDrawerConnectedExample: StoryBrowserDrawerConnected = {
  parameters: {
    layout: "fullscreen",
  },
  args: {
    style: {
      height: "100%",
    },
  },
  decorators: [
    (Story) => (
      <MemoryRouter>
        <IpsumStateProvider projectState={mockSiddhartha().projectState}>
          <div style={{ display: "flex", height: "100vh" }}>
            <div style={{ flexGrow: 1, backgroundColor: "grey" }}></div>
            <Story></Story>
          </div>
        </IpsumStateProvider>
      </MemoryRouter>
    ),
  ],
};
