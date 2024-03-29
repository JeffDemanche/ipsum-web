import { BreadcrumbsHeader } from "components/BreadcrumbsHeader";
import { DiptychContext } from "components/DiptychContext";
import { Median } from "components/Median";
import React, { useContext } from "react";
import styles from "./Diptych.less";
import { DiptychColumn } from "./DiptychColumn";

export const Diptych: React.FunctionComponent = () => {
  const { layers } = useContext(DiptychContext);

  const leftHandLayerIndex = layers.length <= 1 ? 0 : layers.length - 2;
  const rightHandLayerIndex = layers.length > 1 ? layers.length - 1 : undefined;

  const leftHandLayer = layers[leftHandLayerIndex];
  const rightHandLayer = layers[rightHandLayerIndex];

  return (
    <div className={styles["diptych-and-breadcrumbs"]}>
      <div className={styles["breadcrumbs-container"]}>
        <BreadcrumbsHeader />
      </div>
      <div className={styles["diptych-container"]}>
        {/* Render column 1 even if there is no left hand layer to avoid layout shift */}
        <div className={styles["column-1"]}>
          {leftHandLayer && (
            <DiptychColumn
              layer={leftHandLayer}
              layerIndex={leftHandLayerIndex}
            ></DiptychColumn>
          )}
        </div>
        {rightHandLayer && (
          <div className={styles["column-2"]}>
            <DiptychColumn
              layer={rightHandLayer}
              layerIndex={rightHandLayerIndex}
            ></DiptychColumn>
          </div>
        )}
        <Median />
      </div>
    </div>
  );
};
