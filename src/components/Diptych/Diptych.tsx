import { DiptychContext } from "components/DiptychContext";
import { HighlightSelectionContext } from "components/HighlightSelectionContext";
import { Median } from "components/Median";
import React, { useContext, useMemo } from "react";
import styles from "./Diptych.less";
import { DiptychColumn } from "./DiptychColumn";

export const Diptych: React.FunctionComponent = () => {
  const { selectedHighlightIds } = useContext(HighlightSelectionContext);
  const { layersBySide, layers } = useContext(DiptychContext);

  const showMedian = useMemo(
    () =>
      selectedHighlightIds?.length === 1 ||
      (layers[1]?.type === "ArcDetail" && layers[1]?.diptychMedian),
    [layers, selectedHighlightIds?.length]
  );

  return (
    <div className={styles["diptych-container"]}>
      {layers.length >= 1 && (
        <div className={styles["column-1"]}>
          <DiptychColumn
            diptychIndex={0}
            layers={layersBySide[0]}
          ></DiptychColumn>
        </div>
      )}
      {showMedian && <Median></Median>}
      {layers[1]?.type === "ArcDetail" && layers[1]?.arcId && (
        <div className={styles["column-2"]}>
          <DiptychColumn
            diptychIndex={1}
            layers={layersBySide[1]}
          ></DiptychColumn>
        </div>
      )}
    </div>
  );
};
