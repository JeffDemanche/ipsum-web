import type { Meta, StoryObj } from "@storybook/react";

import { LexicalFilterSelector } from "../LexicalFilterSelector";

const meta: Meta<typeof LexicalFilterSelector> = {
  title: "Molecules/LexicalFilterSelector",
  component: LexicalFilterSelector,
};

export default meta;
type Story = StoryObj<typeof LexicalFilterSelector>;

export const LexicalFilterSelectorExample: Story = {
  args: {
    editMode: true,
    programText: "highlights",
    relationChooserProps: {
      arcResults: [{ id: "1", hue: 0, name: "arc1" }],
      onArcCreate: () => "",
      onArcSearch: () => {},
      onRelationChoose: () => {},
    },
    dataOnDay: async () => ({
      entry: Math.random() > 0.5,
      arcs: [
        Math.random() > 0.5
          ? { name: "Arc 1", hue: Math.round(Math.random() * 360) }
          : undefined,
      ].filter((arc) => arc !== undefined),
    }),
    arcByIdOrName: (idOrName: string) => {
      return {
        "1": { id: "1", name: "arc1", color: 0 },
        arc1: { id: "1", name: "arc1", color: 0 },
      }[idOrName];
    },
  },
};
