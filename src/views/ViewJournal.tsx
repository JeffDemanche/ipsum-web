import { Calendar } from "components/Calendar/Calendar";
import React from "react";
import { Surface } from "../components/Surface/Surface";
import { SurfaceEditorContextProvider } from "../components/Surface/SurfaceEditorContext";
import styles from "./ViewJournal.less";

export const ViewJournal: React.FC = () => {
  return (
    <SurfaceEditorContextProvider>
      <div className={styles["view-journal"]}>
        <div className={styles["fixed-width-interior"]}>
          <div className={styles["diptych"]}>
            <div className={styles["column-1"]}>
              <div className={styles["column-1-floating"]}>
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
  );
};
