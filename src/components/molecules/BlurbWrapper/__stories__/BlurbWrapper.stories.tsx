import type { Meta, StoryObj } from "@storybook/react";
import { Type } from "components/atoms/Type";
import React from "react";

import { BlurbWrapper } from "../BlurbWrapper";

const meta: Meta<typeof BlurbWrapper> = {
  title: "Molecules/BlurbWrapper",
  component: BlurbWrapper,
};

export default meta;
type Story = StoryObj<typeof BlurbWrapper>;

export const BlurbWrapperExample: Story = {
  args: {
    style: { width: "400px" },
    collapsible: true,
    maxHeightCollapsed: "100px",
    children: (
      <Type variant="sans" size="12pt" weight="light">
        In my quest for enlightenment, I am drawn to the teachings of the
        Samanas, ascetic wanderers who have renounced the material world in
        pursuit of spiritual enlightenment. Their austere way of life speaks to
        something deep within me, a yearning to transcend the limitations of the
        flesh and attain spiritual liberation. I approach the Samanas with
        humility and reverence, eager to learn from their wisdom and discipline.
        Under their guidance, I embark upon a journey of self-denial and
        introspection, casting aside the trappings of my former life in search
        of a deeper understanding of the self. Each day brings new challenges
        and revelations as I strive to master the art of meditation and
        self-discipline. The rigors of asceticism test my resolve, pushing me to
        the brink of physical and mental endurance. And yet, amidst the trials
        and tribulations, I find a sense of inner peace and tranquility that
        eludes me in the material world.
      </Type>
    ),
  },
};
