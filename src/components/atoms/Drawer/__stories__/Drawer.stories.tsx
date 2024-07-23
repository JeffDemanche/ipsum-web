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
  parameters: {
    layout: "fullscreen",
  },
  args: {
    openedContent: <Typography>Content</Typography>,
  },
};

export const DrawerWithHandleContent: Story = {
  parameters: {
    layout: "fullscreen",
  },
  args: {
    openedContent: <Typography>Content</Typography>,
    handleContent: (
      <Button>
        <Today />
      </Button>
    ),
  },
};

export const DrawerWithClosedContent: Story = {
  parameters: {
    layout: "fullscreen",
  },
  args: {
    openedContent: (
      <Typography>
        Opened<br></br>Content
      </Typography>
    ),
    closedContent: <Typography>Closed</Typography>,
  },
};
