import { DiptychContext } from "components/DiptychContext/DiptychContext";
import { Median } from "components/Median/Median";
import React, { useContext } from "react";
import styles from "./Diptych.less";
import { DiptychColumn } from "./DiptychColumn";

export const Diptych: React.FC = () => {
  const { layersBySide, layers } = useContext(DiptychContext);

  return (
    <div className={styles["diptych-container"]}>
      {layers.length >= 1 && (
        <div className={styles["column-1"]}>
          <DiptychColumn layers={layersBySide[0]}></DiptychColumn>
        </div>
      )}
      {layers.length >= 2 && (
        <>
          <Median></Median>
          <div className={styles["column-2"]}>
            <DiptychColumn layers={layersBySide[1]}></DiptychColumn>
          </div>
        </>
      )}
    </div>
  );
};
