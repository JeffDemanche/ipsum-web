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
    editable: true,
    expanded: true,
    showAlias: false,
    showEdit: false,
    relations: [
      {
        predicate: "is",
        arc: {
          id: "1",
          hue: 124,
          name: "arc1",
        },
      },
      {
        predicate: "relates to",
        arc: {
          id: "2",
          hue: 236,
          name: "arc2",
        },
      },
      {
        predicate: "relates to",
        arc: {
          id: "3",
          hue: 85,
          name: "arc3",
        },
      },
    ],
  },
};

export const RelationsTableExampleWithClauses: Story = {
  args: {
    editable: true,
    expanded: true,
    showAlias: false,
    showEdit: false,
    clauses: {
      and: [
        {
          orRelations: [
            {
              predicate: "is",
              arc: {
                id: "1",
                hue: 124,
                name: "arc1",
              },
            },
            {
              predicate: "relates to",
              arc: {
                id: "2",
                hue: 236,
                name: "arc2",
              },
            },
          ],
        },
        {
          orRelations: [
            {
              predicate: "relates to",
              arc: {
                id: "3",
                hue: 85,
                name: "arc3",
              },
            },
            {
              predicate: "relates to",
              arc: {
                id: "4",
                hue: 124,
                name: "arc4",
              },
            },
          ],
        },
      ],
    },
  },
};
