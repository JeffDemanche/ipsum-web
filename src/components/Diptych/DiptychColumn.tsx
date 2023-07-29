import { ArcDetail } from "components/ArcDetail";
import { DiptychContext, DiptychLayer } from "components/DiptychContext";
import { DailyJournal } from "components/DailyJournal";
import React, { useCallback, useContext, useMemo } from "react";
import styles from "./DiptychColumn.less";
import { LayerContextProvider } from "./LayerContext";

interface DiptychColumnProps {
  diptychIndex: number;
  layers: DiptychLayer[];
}

export const DiptychColumn: React.FunctionComponent<DiptychColumnProps> = ({
  diptychIndex,
  layers,
}) => {
  const topMostLayer = layers[layers.length - 1];

  const { setLayer } = useContext(DiptychContext);

  const closeColumn = useCallback(() => {
    setLayer(diptychIndex, undefined);
  }, [diptychIndex, setLayer]);

  const content = useMemo(() => {
    switch (topMostLayer.type) {
      case "DailyJournal":
        return <DailyJournal layer={topMostLayer}></DailyJournal>;
      case "ArcDetail":
        return (
          <ArcDetail
            arcId={topMostLayer.arcId}
            incomingHighlightId={topMostLayer.diptychMedian.connectionId}
            closeColumn={closeColumn}
          ></ArcDetail>
        );
      case "ConnectionOnly":
        return null;
    }
  }, [closeColumn, topMostLayer]);

  return (
    <LayerContextProvider diptychLayer={topMostLayer}>
      <div className={styles["diptych-layer"]}>{content}</div>
    </LayerContextProvider>
  );
};
