import { Paper } from "@mui/material";
import React from "react";
import styles from "./DailyJournal.less";
import { DailyJournalEditor } from "./DailyJournalEditor";

export const DailyJournal = () => {
  return (
    <Paper className={styles["daily-journal"]}>
      <div className={styles["daily-journal-scroller"]}>
        <DailyJournalEditor />
      </div>
    </Paper>
  );
};
