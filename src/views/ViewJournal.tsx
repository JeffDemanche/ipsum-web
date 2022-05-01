import React from "react";
import { Surface } from "../components/Surface/Surface";
import styles from "./ViewJournal.less";

export const ViewJournal: React.FC<{}> = () => {
  return (
    <div className={styles["view-journal"]}>
      <div className={styles["fixed-width-interior"]}>
        <div className={styles["diptych"]}>
          <div className={styles["column-1"]}></div>
          <div className={styles["column-2"]}>
            <Surface></Surface>
          </div>
        </div>
      </div>
    </div>
  );
};
