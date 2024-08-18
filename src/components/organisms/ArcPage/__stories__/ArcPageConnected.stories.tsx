import type { Meta, StoryObj } from "@storybook/react";
import { mockSiddhartha } from "mocks/siddhartha/siddhartha";
import React from "react";
import { IpsumStateProvider } from "util/state";

import { ArcPageConnected } from "../ArcPageConnected";

const meta: Meta<typeof ArcPageConnected> = {
  title: "Organisms/ArcPage",
  component: ArcPageConnected,
};

export default meta;
type StoryArcPageConnected = StoryObj<typeof ArcPageConnected>;

export const ArcPageConnectedExample: StoryArcPageConnected = {
  args: {
    arcId: "arc1_attachment",
  },
  decorators: [
    (Story) => (
      <IpsumStateProvider projectState={mockSiddhartha().projectState}>
        <Story />
      </IpsumStateProvider>
    ),
  ],
};
