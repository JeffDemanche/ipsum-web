import { ArcDetail } from "components/ArcDetail";
import { DiptychContext } from "components/DiptychContext";
import { DailyJournal } from "components/DailyJournal";
import React, { useCallback, useContext, useMemo } from "react";
import styles from "./DiptychColumn.less";
import { URLLayer } from "util/url";

interface DiptychColumnProps {
  diptychIndex: number;
  layers: URLLayer[];
}

export const DiptychColumn: React.FunctionComponent<DiptychColumnProps> = ({
  diptychIndex,
  layers,
}) => {
  const topMostLayer = layers[layers.length - 1];
  const secondTopMostLayer = layers[layers.length - 2];

  const content = useMemo(() => {
    switch (topMostLayer.type) {
      case "daily_journal":
        return <DailyJournal layer={topMostLayer}></DailyJournal>;
      case "arc_detail":
        return (
          <ArcDetail
            arcId={topMostLayer.arcId}
            incomingHighlightId={secondTopMostLayer?.highlightTo}
          ></ArcDetail>
        );
    }
  }, [secondTopMostLayer?.highlightTo, topMostLayer]);

  return <div className={styles["diptych-layer"]}>{content}</div>;
};
