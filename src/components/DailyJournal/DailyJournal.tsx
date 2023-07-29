import { Paper } from "@mui/material";
import { DailyJournalLayer } from "components/DiptychContext";
import { VisibleEntriesProvider } from "components/VisibleEntriesContext";
import React from "react";
import SimpleBar from "simplebar-react";
import styles from "./DailyJournal.less";
import { DailyJournalEditor } from "./DailyJournalEditor";

interface DailyJournalProps {
  layer: DailyJournalLayer;
}

export const DailyJournal: React.FunctionComponent<DailyJournalProps> = ({
  layer,
}) => {
  return (
    <VisibleEntriesProvider layer={layer}>
      <Paper variant="outlined" className={styles["daily-journal"]}>
        <SimpleBar className={styles["daily-journal-scroller"]}>
          <DailyJournalEditor />
        </SimpleBar>
      </Paper>
    </VisibleEntriesProvider>
  );
};
