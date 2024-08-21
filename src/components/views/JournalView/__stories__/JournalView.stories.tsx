import { Meta, StoryObj } from "@storybook/react";
import { mockSiddhartha } from "mocks/siddhartha/siddhartha";
import React from "react";
import { MemoryRouter } from "react-router";
import { IpsumStateProvider } from "util/state";
import { useNormalizeUrl } from "util/state/url";

import { JournalView } from "..";

const meta: Meta<typeof JournalView> = {
  title: "Views/JournalView",
  component: JournalView,
};

export default meta;
type StoryJournalView = StoryObj<typeof JournalView>;

const WithNormalizeUrl = ({ children }: { children: React.ReactNode }) => {
  useNormalizeUrl("journal");

  return <>{children}</>;
};

export const JournalViewExample: StoryJournalView = {
  parameters: {
    layout: "fullscreen",
    query: {},
  },
  args: {},
  decorators: [
    (Story) => {
      return (
        <MemoryRouter>
          <IpsumStateProvider projectState={mockSiddhartha().projectState}>
            <WithNormalizeUrl>
              <div style={{ height: "100vh" }}>
                <Story></Story>
              </div>
            </WithNormalizeUrl>
          </IpsumStateProvider>
        </MemoryRouter>
      );
    },
  ],
};
