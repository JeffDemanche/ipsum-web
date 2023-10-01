import { DiptychContext } from "components/DiptychContext";
import { Median } from "components/Median";
import React, { useContext } from "react";
import styles from "./Diptych.less";
import { DiptychColumn } from "./DiptychColumn";

export const Diptych: React.FunctionComponent = () => {
  const { layers } = useContext(DiptychContext);

  const leftHandLayer = layers.at(-2) ?? layers[0];
  const rightHandLayer = layers.length > 1 ? layers.at(-1) : undefined;

  return (
    <div className={styles["diptych-container"]}>
      {layers.length >= 1 && (
        <div className={styles["column-1"]}>
          <DiptychColumn
            diptychIndex={0}
            layers={[leftHandLayer]}
          ></DiptychColumn>
        </div>
      )}
      <Median />
      {rightHandLayer && (
        <div className={styles["column-2"]}>
          <DiptychColumn
            diptychIndex={1}
            layers={[rightHandLayer]}
          ></DiptychColumn>
        </div>
      )}
    </div>
  );
};
