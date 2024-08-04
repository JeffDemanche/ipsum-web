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
  style?: React.CSSProperties;
  className?: string;

  direction?: "down" | "up" | "left" | "right";
  defaultOpen?: boolean;
  handleContent?: React.ReactNode;
  closedContent?: React.ReactNode;
  closedContentClassName?: string;

  openedContent: React.ReactNode;
  openedContentClassName?: string;

  showInsideBorder?: boolean;

  onOpen?: () => void;
  onClose?: () => void;
}

export const Drawer: React.FunctionComponent<DrawerProps> = ({
  style,
  className,
  direction = "down",
  defaultOpen,
  handleContent,
  openedContent,
  openedContentClassName,
  closedContent,
  closedContentClassName,
  showInsideBorder = true,
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
      style={style}
      className={className}
      PaperProps={{
        className: cx(styles["drawer"], styles[direction]),
      }}
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
      <div
        className={cx(
          styles["visible-content"],
          showInsideBorder && styles["inside-border"]
        )}
      >
        <Button
          onClick={() => {
            toggle();
          }}
        >
          <Chevron />
        </Button>
        {handleContent}
      </div>
      {closedContent && (
        <Collapse in={!open} orientation={orientation}>
          <div className={cx(styles["hidden-content"], closedContentClassName)}>
            {closedContent}
          </div>
        </Collapse>
      )}
      <Collapse in={open} orientation={orientation}>
        <div className={cx(styles["hidden-content"], openedContentClassName)}>
          {openedContent}
        </div>
      </Collapse>
    </MuiDrawer>
  );
};
