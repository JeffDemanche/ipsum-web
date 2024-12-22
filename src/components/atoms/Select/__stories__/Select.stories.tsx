import type { Meta, StoryObj } from "@storybook/react";
import { MenuItem } from "components/atoms/MenuItem";
import type { FunctionComponent} from "react";
import React, { useState } from "react";

import { Select } from "../Select";

const WithState: FunctionComponent = () => {
  const [value, setValue] = useState("item 1");

  return (
    <Select value={value}>
      <MenuItem
        value={"item 1"}
        key={"item 1"}
        onClick={() => {
          setValue("item 1");
        }}
      >
        <span>item 1</span>
      </MenuItem>
      <MenuItem
        value={"item 2"}
        key={"item 2"}
        onClick={() => {
          setValue("item 2");
        }}
      >
        <span>item 2</span>
      </MenuItem>
    </Select>
  );
};

const meta: Meta<typeof WithState> = {
  title: "Atoms/Select",
  component: WithState,
};

export default meta;
type Story = StoryObj<typeof WithState>;

export const SelectExample: Story = {
  args: {
    value: "item 1",
    children: (
      <>
        <MenuItem value={"item 1"} key={"item 1"}>
          <span>item 1</span>
        </MenuItem>
        <MenuItem value={"item 2"} key={"item 2"}>
          <span>item 2</span>
        </MenuItem>
      </>
    ),
  },
};
