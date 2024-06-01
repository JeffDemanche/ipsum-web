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
  visibleContent?: React.ReactNode;
  children: React.ReactNode;
}

export const Drawer: React.FunctionComponent<DrawerProps> = ({
  direction = "down",
  visibleContent,
  children,
}) => {
  const [open, setOpen] = useState(true);

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

  return (
    <MuiDrawer
      PaperProps={{ className: cx(styles["drawer"], styles[direction]) }}
      anchor={anchor}
      variant="permanent"
      open={open}
    >
      <div className={styles["visible-content"]}>
        <Button
          onClick={() => {
            setOpen(!open);
          }}
        >
          <Chevron />
        </Button>
        {visibleContent}
      </div>
      <Collapse in={open} orientation={orientation}>
        <div className={cx(styles["hidden-content"])}>{children}</div>
      </Collapse>
    </MuiDrawer>
  );
};
