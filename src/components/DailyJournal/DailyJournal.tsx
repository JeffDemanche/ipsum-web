import { Paper } from "@mui/material";
import React from "react";
import SimpleBar from "simplebar-react";
import styles from "./DailyJournal.less";
import { DailyJournalEditor } from "./DailyJournalEditor";

export const DailyJournal = () => {
  return (
    <Paper variant="outlined" className={styles["daily-journal"]}>
      <SimpleBar className={styles["daily-journal-scroller"]}>
        <DailyJournalEditor />
      </SimpleBar>
    </Paper>
  );
};
