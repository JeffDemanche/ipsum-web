import { Meta, StoryObj } from "@storybook/react";

import { RelationChooser } from "../RelationChooser";

const meta: Meta<typeof RelationChooser> = {
  title: "Molecules/RelationChooser",
  component: RelationChooser,
};

export default meta;
type StoryRelationChooser = StoryObj<typeof RelationChooser>;

export const RelationChooserExample: StoryRelationChooser = {
  args: {
    maxArcResults: 7,
    arcResults: [
      {
        id: "1",
        hue: 120,
        name: "Arc 1",
      },
      {
        id: "2",
        hue: 240,
        name: "Arc 2",
      },
    ],
  },
};
