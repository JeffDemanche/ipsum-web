import { DiptychLayer } from "components/DiptychContext";
import React from "react";
import { URLLayer } from "util/url";

interface LayerContextValue {
  layerDataFromURL: URLLayer;
}

/**
 * A context that wraps an individual layer and provides details about it.
 */
export const LayerContext = React.createContext<LayerContextValue>({
  layerDataFromURL: null,
});

interface LayerContextProviderProps {
  children: React.ReactNode;
  diptychLayer: DiptychLayer;
}

export const LayerContextProvider: React.FunctionComponent<
  LayerContextProviderProps
> = ({ children, diptychLayer }) => {
  return (
    <LayerContext.Provider value={{ layerDataFromURL: null }}>
      {children}
    </LayerContext.Provider>
  );
};
