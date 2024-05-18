import type { Meta, StoryObj } from "@storybook/react";

import { RelationsTable } from "../RelationsTable";

const meta: Meta<typeof RelationsTable> = {
  title: "Molecules/RelationsTable",
  component: RelationsTable,
};

export default meta;
type Story = StoryObj<typeof RelationsTable>;

export const RelationsTableExample: Story = {
  args: {
    expanded: true,
    relations: [
      {
        id: "1",
        predicate: "predicate1",
        arc: {
          id: "1",
          hue: 0,
          name: "arc1",
        },
      },
      {
        id: "2",
        predicate: "predicate1",
        arc: {
          id: "2",
          hue: 0,
          name: "arc2",
        },
      },
      {
        id: "3",
        predicate: "predicate2",
        arc: {
          id: "3",
          hue: 0,
          name: "arc3",
        },
      },
    ],
  },
};
