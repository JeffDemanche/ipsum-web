import React from "react";
import { InMemoryArc } from "state/in-memory/in-memory-state";
import { IpsumArcColor } from "util/colors";
import styles from "./ArcDetail.less";

interface ArcDetailProps {
  arc: InMemoryArc;
}

export const ArcDetail: React.FC<ArcDetailProps> = ({ arc }) => {
  const color = new IpsumArcColor(arc.color);

  return (
    <div className={styles["arc-detail"]}>
      <div className={styles["arc-colorful-backdrop"]}></div>
    </div>
  );
};
