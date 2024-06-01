import { Today } from "@mui/icons-material";
import { Button, Typography } from "@mui/material";
import type { Meta, StoryObj } from "@storybook/react";
import React from "react";

import { Drawer } from "../Drawer";

const meta: Meta<typeof Drawer> = {
  title: "Atoms/Drawer",
  component: Drawer,
};

export default meta;
type Story = StoryObj<typeof Drawer>;

export const DrawerExample: Story = {
  args: {
    children: <Typography>Content</Typography>,
  },
};

export const DrawerWithVisibleContent: Story = {
  args: {
    children: <Typography>Content</Typography>,
    visibleContent: (
      <Button>
        <Today />
      </Button>
    ),
  },
};
