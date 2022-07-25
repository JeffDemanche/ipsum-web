import { Calendar } from "components/Calendar/Calendar";
import { JournalInfoBox } from "components/JournalInfoBox/JournalInfoBox";
import React from "react";
import { Surface } from "../components/Surface/Surface";
import { SurfaceEditorContextProvider } from "../components/Surface/SurfaceEditorContext";
import styles from "./ViewJournal.less";
import { VisibleEntriesProvider } from "./VisibleEntriesContext";

export const ViewJournal: React.FC = () => {
  return (
    <VisibleEntriesProvider>
      <SurfaceEditorContextProvider>
        <div className={styles["view-journal"]}>
          <div className={styles["fixed-width-interior"]}>
            <div className={styles["diptych"]}>
              <div className={styles["column-1"]}>
                <div className={styles["column-1-floating"]}>
                  <JournalInfoBox></JournalInfoBox>
                  <Calendar></Calendar>
                </div>
              </div>
              <div className={styles["column-2"]}>
                <Surface></Surface>
              </div>
            </div>
          </div>
        </div>
      </SurfaceEditorContextProvider>
    </VisibleEntriesProvider>
  );
};
