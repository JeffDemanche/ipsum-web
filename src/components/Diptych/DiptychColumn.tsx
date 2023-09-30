import { ArcDetail } from "components/ArcDetail";
import { DailyJournal } from "components/DailyJournal";
import React, { useMemo } from "react";
import styles from "./DiptychColumn.less";
import { URLLayer } from "util/url";
import { LayerProvider } from "./LayerContext";

interface DiptychColumnProps {
  diptychIndex: number;
  layers: URLLayer[];
}

export const DiptychColumn: React.FunctionComponent<DiptychColumnProps> = ({
  diptychIndex,
  layers,
}) => {
  const topMostLayerIndex = layers.length - 1;
  const topMostLayer = layers[topMostLayerIndex];

  const secondTopMostLayerIndex = layers.length - 2;
  const secondTopMostLayer = layers[secondTopMostLayerIndex];

  const content = useMemo(() => {
    switch (topMostLayer.type) {
      case "daily_journal":
        return (
          <LayerProvider
            layer={topMostLayer}
            previousLayer={secondTopMostLayer}
            layerIndex={topMostLayerIndex}
          >
            <DailyJournal />
          </LayerProvider>
        );
      case "arc_detail":
        return (
          <LayerProvider
            layer={topMostLayer}
            previousLayer={secondTopMostLayer}
            layerIndex={topMostLayerIndex}
          >
            <ArcDetail />
          </LayerProvider>
        );
    }
  }, [secondTopMostLayer, topMostLayer, topMostLayerIndex]);

  return <div className={styles["diptych-layer"]}>{content}</div>;
};
