import type { Meta, StoryObj } from "@storybook/react";
import { mockSiddhartha } from "mocks/siddhartha/siddhartha";
import React from "react";
import { IpsumStateProvider } from "util/state";

import { HighlightPageConnected } from "../HighlightPageConnected";

const meta: Meta<typeof HighlightPageConnected> = {
  title: "Organisms/HighlightPage",
  component: HighlightPageConnected,
};

export default meta;
type StoryHighlightPageConnected = StoryObj<typeof HighlightPageConnected>;

export const HighlightPageConnectedExample: StoryHighlightPageConnected = {
  args: {
    highlightId: "highlight-chapter1-p-0",
  },
  decorators: [
    (Story) => (
      <IpsumStateProvider projectState={mockSiddhartha().projectState}>
        <Story />
      </IpsumStateProvider>
    ),
  ],
};
