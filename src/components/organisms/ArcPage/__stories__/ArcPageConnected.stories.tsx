import type { Meta, StoryObj } from "@storybook/react";
import { mockSiddhartha } from "mocks/siddhartha/siddhartha";
import React from "react";
import { MemoryRouter } from "react-router";
import { dataToSearchParams, IpsumStateProvider } from "util/state";

import { ArcPageConnected } from "../ArcPageConnected";

const meta: Meta<typeof ArcPageConnected> = {
  title: "Organisms/ArcPage",
  component: ArcPageConnected,
};

export default meta;
type StoryArcPageConnected = StoryObj<typeof ArcPageConnected>;

export const ArcPageConnectedExample: StoryArcPageConnected = {
  args: {
    layerIndex: 0,
    arcId: "arc1_attachment",
  },
  decorators: [
    (Story) => (
      <MemoryRouter
        initialEntries={[
          `?${dataToSearchParams<"journal">({
            layers: [
              {
                type: "highlight_detail",
                highlightId: "highlight-chapter1-p-0",
                expanded: "true",
              },
            ],
          })}`,
        ]}
      >
        <IpsumStateProvider projectState={mockSiddhartha().projectState}>
          <Story />
        </IpsumStateProvider>
      </MemoryRouter>
    ),
  ],
};
