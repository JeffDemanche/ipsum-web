import { DiptychContext } from "components/DiptychContext";
import { Median } from "components/Median";
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
      {layers[1]?.type === "ArcDetail" && layers[1]?.highlightId && (
        <Median></Median>
      )}
      {layers[1]?.type === "ArcDetail" && layers[1]?.arcId && (
        <div className={styles["column-2"]}>
          <DiptychColumn layers={layersBySide[1]}></DiptychColumn>
        </div>
      )}
    </div>
  );
};
