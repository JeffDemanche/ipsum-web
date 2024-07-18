import {
  ChevronLeft,
  ChevronRight,
  ExpandLess,
  ExpandMore,
} from "@mui/icons-material";
import { Button, Collapse, Drawer as MuiDrawer } from "@mui/material";
import cx from "classnames";
import React, { useMemo, useState } from "react";

import styles from "./Drawer.less";

interface DrawerProps {
  direction?: "down" | "up" | "left" | "right";
  defaultOpen?: boolean;
  handleContent?: React.ReactNode;
  closedContent?: React.ReactNode;
  openedContent: React.ReactNode;

  onOpen?: () => void;
  onClose?: () => void;
}

export const Drawer: React.FunctionComponent<DrawerProps> = ({
  direction = "down",
  defaultOpen,
  handleContent,
  openedContent,
  closedContent,
  onOpen,
  onClose,
}) => {
  const [open, setOpen] = useState(defaultOpen);

  const Chevron = useMemo(() => {
    switch (direction) {
      case "down":
        return open ? ExpandLess : ExpandMore;
      case "up":
        return open ? ExpandMore : ExpandLess;
      case "left":
        return open ? ChevronRight : ChevronLeft;
      case "right":
        return open ? ChevronLeft : ChevronRight;
    }
  }, [direction, open]);

  const anchor = useMemo(() => {
    switch (direction) {
      case "down":
        return "top";
      case "up":
        return "bottom";
      case "left":
        return "right";
      case "right":
        return "left";
    }
  }, [direction]);

  const orientation = useMemo(() => {
    switch (direction) {
      case "down":
      case "up":
        return "vertical";
      case "left":
      case "right":
        return "horizontal";
    }
  }, [direction]);

  const toggle = () => {
    if (open) {
      onClose?.();
    } else {
      onOpen?.();
    }
    setOpen(!open);
  };

  return (
    <MuiDrawer
      PaperProps={{ className: cx(styles["drawer"], styles[direction]) }}
      sx={{
        "& .MuiDrawer-root": {
          position: "relative",
        },
        "& .MuiPaper-root": {
          position: "relative",
        },
      }}
      anchor={anchor}
      variant="permanent"
      open={open}
    >
      <div className={styles["visible-content"]}>
        <Button
          onClick={() => {
            toggle();
          }}
        >
          <Chevron />
        </Button>
        {handleContent}
      </div>
      <Collapse in={!open} orientation={orientation}>
        <div className={styles["hidden-content"]}>{closedContent}</div>
      </Collapse>
      <Collapse in={open} orientation={orientation}>
        <div className={styles["hidden-content"]}>{openedContent}</div>
      </Collapse>
    </MuiDrawer>
  );
};
