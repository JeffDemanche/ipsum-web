import React from "react";
import { URLLayer } from "util/url";

interface LayerContextValue {
  layer: URLLayer;
  layerIndex: number;
  previousLayer?: URLLayer;
}

interface LayerProviderProps {
  layer: URLLayer;
  previousLayer?: URLLayer;
  layerIndex: number;
  children: React.ReactNode;
}

export const LayerContext = React.createContext<LayerContextValue>({
  layer: null,
  layerIndex: null,
  previousLayer: null,
});

export const LayerProvider: React.FunctionComponent<LayerProviderProps> = ({
  children,
  layer,
  layerIndex,
  previousLayer,
}) => {
  return (
    <LayerContext.Provider value={{ layer, layerIndex, previousLayer }}>
      {children}
    </LayerContext.Provider>
  );
};
