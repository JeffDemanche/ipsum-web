import React from "react";
import { URLLayer } from "util/state/url";

interface LayerContextValue {
  layer: URLLayer;
  layerIndex: number;
}

interface LayerProviderProps {
  layer: URLLayer;
  layerIndex: number;
  children: React.ReactNode;
}

export const LayerContext = React.createContext<LayerContextValue>({
  layer: null,
  layerIndex: null,
});

export const LayerProvider: React.FunctionComponent<LayerProviderProps> = ({
  children,
  layer,
  layerIndex,
}) => {
  return (
    <LayerContext.Provider value={{ layer, layerIndex }}>
      {children}
    </LayerContext.Provider>
  );
};
