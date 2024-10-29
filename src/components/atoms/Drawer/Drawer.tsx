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
  showWrappingBorder?: boolean;

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
  showWrappingBorder = false,
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

  const showInsideBorderIfOpenOrNoClosedContent =
    (open || closedContent) && showInsideBorder;

  const handle = (
    <div
      className={cx(
        styles[`visible-content-${direction}`],
        showInsideBorderIfOpenOrNoClosedContent && styles["inside-border"]
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
  );

  const content = (
    <>
      {closedContent && (
        <Collapse in={!open} orientation={orientation}>
          <div
            className={cx(
              styles["hidden-content"],
              styles["closed-container"],
              closedContentClassName
            )}
          >
            {closedContent}
          </div>
        </Collapse>
      )}
      <Collapse in={open} orientation={orientation}>
        <div
          className={cx(
            styles["hidden-content"],
            styles["opened-container"],
            openedContentClassName
          )}
        >
          {openedContent}
        </div>
      </Collapse>
    </>
  );

  return (
    <MuiDrawer
      style={style}
      className={cx(className, showWrappingBorder && styles["wrapping-border"])}
      PaperProps={{
        style: {
          border: "none",
        },
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
      {direction === "right" || direction === "down" ? (
        <>
          {content}
          {handle}
        </>
      ) : (
        <>
          {handle}
          {content}
        </>
      )}
    </MuiDrawer>
  );
};
