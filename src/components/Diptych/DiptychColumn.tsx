import { ArcDetail } from "components/ArcDetail";
import { DailyJournal } from "components/DailyJournal";
import React, { useMemo } from "react";
import styles from "./DiptychColumn.less";
import { URLLayer } from "util/url";
import { LayerProvider } from "./LayerContext";

interface DiptychColumnProps {
  layer: URLLayer;
  layerIndex: number;
}

export const DiptychColumn: React.FunctionComponent<DiptychColumnProps> = ({
  layer,
  layerIndex,
}) => {
  const content = useMemo(() => {
    switch (layer.type) {
      case "daily_journal":
        return (
          <LayerProvider layer={layer} layerIndex={layerIndex}>
            <DailyJournal />
          </LayerProvider>
        );
      case "arc_detail":
        return (
          <LayerProvider layer={layer} layerIndex={layerIndex}>
            <ArcDetail key={layer.arcId} />
          </LayerProvider>
        );
      case "highlight_detail":
        return (
          <LayerProvider layer={layer} layerIndex={layerIndex}>
            TODO Highlight detail
            {/* <HighlightDetail key={layer.highlightId} /> */}
          </LayerProvider>
        );
    }
  }, [layer, layerIndex]);

  return <div className={styles["diptych-layer"]}>{content}</div>;
};
