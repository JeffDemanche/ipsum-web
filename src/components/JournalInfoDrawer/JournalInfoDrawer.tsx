import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import { Collapse, Drawer, IconButton } from "@mui/material";
import cx from "classnames";
import { JournalDateRangePicker } from "components/JournalDateRangePicker";
import { JournalInfoBox } from "components/JournalInfoBox";
import React, { useState } from "react";

import styles from "./JournalInfoDrawer.less";

export const JournalInfoDrawer: React.FunctionComponent = () => {
  const [open, setOpen] = useState(true);

  return (
    <Drawer
      open={open}
      variant="permanent"
      sx={{ flex: "initial" }}
      className={styles["drawer-container"]}
      PaperProps={{
        sx: {
          position: "relative",
          background: "rgba(255, 255, 255, 0.6)",
        },
        className: styles["drawer-paper"],
      }}
    >
      <div className={styles["drawer-content-container"]}>
        <div className={styles["drawer-right"]}>
          <IconButton
            onClick={() => {
              setOpen(!open);
            }}
          >
            {open ? <ChevronLeft></ChevronLeft> : <ChevronRight></ChevronRight>}
          </IconButton>
        </div>
        <Collapse
          in={open}
          orientation="horizontal"
          className={cx(styles["drawer-left"], {
            [styles["collapsed"]]: !open,
          })}
        >
          <div>
            <JournalInfoBox></JournalInfoBox>
            <JournalDateRangePicker></JournalDateRangePicker>
          </div>
        </Collapse>
      </div>
    </Drawer>
  );
};
