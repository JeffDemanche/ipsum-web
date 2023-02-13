import { ArcDetail } from "components/ArcDetail/ArcDetail";
import { DiptychLayer } from "components/DiptychContext/types";
import { Surface } from "components/Surface/Surface";
import React from "react";
import styles from "./DiptychColumn.less";

interface DiptychColumnProps {
  layers: DiptychLayer[];
}

export const DiptychColumn: React.FunctionComponent<DiptychColumnProps> = ({
  layers,
}) => {
  const topMostLayer = layers[layers.length - 1];

  return (
    <div className={styles["diptych-layer"]}>
      {topMostLayer.type === "DailyJournal" ? (
        <Surface></Surface>
      ) : (
        <ArcDetail assignmentId={topMostLayer.assignmentId}></ArcDetail>
      )}
    </div>
  );
};
