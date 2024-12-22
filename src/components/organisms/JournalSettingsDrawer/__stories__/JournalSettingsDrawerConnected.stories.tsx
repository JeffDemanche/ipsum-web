import type { Meta, StoryObj } from "@storybook/react";
import { mockSiddhartha } from "mocks/siddhartha/siddhartha";
import React from "react";
import { MemoryRouter } from "react-router";
import { IpsumStateProvider } from "util/state";

import { JournalSettingsDrawerConnected } from "../JournalSettingsDrawerConnected";

const meta: Meta<typeof JournalSettingsDrawerConnected> = {
  title: "Organisms/JournalSettingsDrawer",
  component: JournalSettingsDrawerConnected,
};

export default meta;
type StoryJournalSettingsDrawerConnected = StoryObj<
  typeof JournalSettingsDrawerConnected
>;

export const JournalSettingsDrawerConnectedExample: StoryJournalSettingsDrawerConnected =
  {
    parameters: {
      layout: "fullscreen",
      query: {},
    },
    args: {},
    decorators: [
      (Story) => (
        <MemoryRouter>
          <IpsumStateProvider projectState={mockSiddhartha().projectState}>
            <div style={{ display: "flex", height: "100vh" }}>
              <Story></Story>
              <div style={{ flexGrow: 1, backgroundColor: "grey" }}></div>
            </div>
          </IpsumStateProvider>
        </MemoryRouter>
      ),
    ],
  };
