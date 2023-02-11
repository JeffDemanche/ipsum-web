import { ArcNavigator } from "components/ArcNavigator/ArcNavigator";
import { Surface } from "components/Surface/Surface";
import React from "react";
import styles from "./DiptychColumn.less";

interface DiptychColumnProps {
  layers: Layer[];
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
        <ArcNavigator></ArcNavigator>
      )}
    </div>
  );
};
