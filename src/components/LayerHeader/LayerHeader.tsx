import { Close } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import { LayerContext } from "components/Diptych";
import { DiptychContext } from "components/DiptychContext";
import React, { useContext } from "react";

import styles from "./LayerHeader.less";

interface LayerHeaderProps {
  children?: React.ReactNode;
}

export const LayerHeader: React.FunctionComponent<LayerHeaderProps> = ({
  children,
}) => {
  const { layers, popLayer } = useContext(DiptychContext);
  const { layerIndex } = useContext(LayerContext);

  const showCloseButton = layers.length > 1 && layerIndex === layers.length - 1;

  return (
    <div className={styles["layer-header"]}>
      {showCloseButton && (
        <IconButton onClick={popLayer}>
          <Close />
        </IconButton>
      )}
      {children}
    </div>
  );
};
