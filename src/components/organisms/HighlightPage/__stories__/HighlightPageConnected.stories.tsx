import type { Meta, StoryObj } from "@storybook/react";
import { mockSiddhartha } from "mocks/siddhartha/siddhartha";
import React from "react";
import { MemoryRouter } from "react-router";
import { dataToSearchParams, IpsumStateProvider } from "util/state";

import { HighlightPageConnected } from "../HighlightPageConnected";

const meta: Meta<typeof HighlightPageConnected> = {
  title: "Organisms/HighlightPage",
  component: HighlightPageConnected,
};

export default meta;
type StoryHighlightPageConnected = StoryObj<typeof HighlightPageConnected>;

export const HighlightPageConnectedExample: StoryHighlightPageConnected = {
  args: {
    layerIndex: 0,
    highlightId: "highlight-chapter1-p-0",
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
