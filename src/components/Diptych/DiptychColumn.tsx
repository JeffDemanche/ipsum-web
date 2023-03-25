import { ArcDetail } from "components/ArcDetail";
import { DiptychContext, DiptychLayer } from "components/DiptychContext";
import { DailyJournal } from "components/DailyJournal";
import React, { useCallback, useContext } from "react";
import styles from "./DiptychColumn.less";

interface DiptychColumnProps {
  diptychIndex: number;
  layers: DiptychLayer[];
}

export const DiptychColumn: React.FunctionComponent<DiptychColumnProps> = ({
  diptychIndex,
  layers,
}) => {
  const topMostLayer = layers[layers.length - 1];

  const { closeLayer } = useContext(DiptychContext);

  const closeColumn = useCallback(() => {
    closeLayer(diptychIndex, false);
  }, [closeLayer, diptychIndex]);

  return (
    <div className={styles["diptych-layer"]}>
      {topMostLayer.type === "DailyJournal" ? (
        <DailyJournal></DailyJournal>
      ) : (
        <ArcDetail
          arcId={topMostLayer.arcId}
          incomingHighlightId={topMostLayer.diptychMedian.connectionId}
          closeColumn={closeColumn}
        ></ArcDetail>
      )}
    </div>
  );
};
