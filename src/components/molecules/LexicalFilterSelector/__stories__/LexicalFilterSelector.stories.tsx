import type { Meta, StoryObj } from "@storybook/react";
import React, { useState } from "react";
import { createFilteringProgram, IpsumFilteringProgram } from "util/filtering";

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
  },
};

export const LexicalFilterSelectorStatefulExample: Story = {
  decorators: [
    (Story) => {
      const [filterProgram, setFilterProgram] = useState<IpsumFilteringProgram>(
        createFilteringProgram("v1").setProgram(
          'highlights (from "1" to "2" and which relates to "3") sorted by recent as of "1"'
        )
      );

      return (
        <div>
          <Story
            args={{
              programText: filterProgram.programString,
              onFilterProgramChange: (program) =>
                setFilterProgram((oldProgram) =>
                  oldProgram.setProgram(program)
                ),
            }}
          />
        </div>
      );
    },
  ],
  args: {
    editMode: true,
    programText:
      'highlights (from "1" to "2" and which relates to "3") sorted by recent as of "1"',
  },
};
