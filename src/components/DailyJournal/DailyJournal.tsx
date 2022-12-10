import { Calendar } from "components/Calendar/Calendar";
import { JournalInfoBox } from "components/JournalInfoBox/JournalInfoBox";
import { Surface } from "components/Surface/Surface";
import React from "react";
import styles from "./DailyJournal.less";

export const DailyJournal: React.FC = () => {
  return (
    <div className={styles["daily-journal-container"]}>
      <div className={styles["column-1"]}>
        <JournalInfoBox></JournalInfoBox>
        <Calendar></Calendar>
      </div>
      <div className={styles["column-2"]}>
        <Surface></Surface>
      </div>
    </div>
  );
};
