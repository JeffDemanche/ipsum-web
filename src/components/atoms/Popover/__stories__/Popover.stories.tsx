import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "components/atoms/Button";
import { Type } from "components/atoms/Type";
import React, { useState } from "react";

import { Popover } from "../Popover";

const WithButton: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  return (
    <div>
      <Button
        onClick={(event) => {
          setAnchorEl(event.currentTarget);
        }}
      >
        Open
      </Button>
      <Popover
        anchorEl={anchorEl}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        onClose={() => {
          setAnchorEl(null);
        }}
      >
        {children}
      </Popover>
    </div>
  );
};

const meta: Meta<typeof WithButton> = {
  title: "Atoms/Popover",
  component: WithButton,
};

export default meta;
type Story = StoryObj<typeof WithButton>;

export const PopoverExample: Story = {
  args: {
    children: (
      <Type variant="body" weight="light" size="14pt">
        Popover content
      </Type>
    ),
  },
};
