import { ChevronLeft } from "@mui/icons-material";
import { Drawer, IconButton } from "@mui/material";
import { Calendar } from "components/Calendar";
import { JournalInfoBox } from "components/JournalInfoBox";
import React from "react";
import styles from "./JournalInfoDrawer.less";

export const JournalInfoDrawer: React.FunctionComponent = () => {
  return (
    <Drawer
      open
      variant="persistent"
      sx={{ flex: "initial" }}
      className={styles["drawer-container"]}
      PaperProps={{
        sx: {
          position: "relative",
        },
        className: styles["drawer-paper"],
      }}
    >
      <div className={styles["drawer-content-container"]}>
        <IconButton>
          <ChevronLeft></ChevronLeft>
        </IconButton>
        <JournalInfoBox></JournalInfoBox>
        <Calendar></Calendar>
      </div>
    </Drawer>
  );
};
