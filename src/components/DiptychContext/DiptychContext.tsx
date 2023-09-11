import React, { useCallback, useEffect, useMemo } from "react";
import { useLocation, useNavigate } from "react-router";
import { dataToSearchParams, URLLayer, urlToData } from "util/url";
import { Diptych, DiptychLayer } from "./types";

export const DiptychContext = React.createContext<Diptych>({
  layers: [],
  layersBySide: { 0: [], 1: [] },
  topLayerIndex: 0,

  setLayer: () => {},
  setConnection: () => {},
  setTopLayer: () => {},
  setTopConnection: () => {},
});

interface DiptychProviderProps {
  children: React.ReactNode;
}

export const DiptychProvider: React.FunctionComponent<DiptychProviderProps> = ({
  children,
}) => {
  const navigate = useNavigate();

  const location = useLocation();
  const urlData = useMemo(
    () => urlToData<"journal">(window.location.href),
    [location]
  );

  const urlLayers = useMemo(() => urlData.layers ?? [], [urlData.layers]);

  const layers: DiptychLayer[] = useMemo(() => {
    return [
      ...urlLayers.map((urlLayer, index): DiptychLayer => {
        switch (urlLayer.type) {
          case "connection_only":
            return {
              type: "ConnectionOnly",
              index,
              diptychMedian: {
                connectionId: urlLayer.connectionId,
              },
              urlLayer,
            };
          case "arc_detail":
            return {
              type: "ArcDetail",
              index,
              arcId: urlLayer.arcId,
              urlLayer,
              diptychMedian: {
                connectionId: urlLayer.connectionId,
              },
            };
          case "daily_journal":
            return {
              type: "DailyJournal",
              index,
              urlLayer,
              focusedDate: urlLayer.focusedDate,
              startDate: urlLayer.startDate,
              endDate: urlLayer.endDate,
              diptychMedian: {
                connectionId: urlLayer.connectionId,
              },
            };
        }
      }),
    ];
  }, [urlLayers]);

  const layersBySide = useMemo(() => {
    return {
      0: layers.filter((l, i) => i % 2 === 0),
      1: layers.filter((l, i) => i % 2 !== 0),
    };
  }, [layers]);

  const topLayerIndex = layers.length - 1;

  const setLayer = useCallback(
    (index: number, layer?: URLLayer) => {
      if (index > 0 && layer && !layer.connectionId)
        throw new Error("setLayer: no connectionId for non-base layer");

      const currParams = urlToData<"journal">(window.location.href);
      const currentLayers = currParams.layers ?? [];
      const newLayers = [...currentLayers.slice(0, index)];
      if (layer) newLayers[index] = layer;
      const newSearchParams = dataToSearchParams<"journal">({
        ...currParams,
        layers: newLayers,
      });
      navigate({ search: newSearchParams }, { replace: true });
    },
    [navigate]
  );

  const setConnection = useCallback(
    (index: number, connectionId?: string) => {
      if (index < 1 || index > topLayerIndex + 1)
        throw new Error(`setConnection: invalid index: ${index}`);

      const currParams = urlToData<"journal">(window.location.href);
      const currentLayers = currParams.layers ?? [];
      const newLayers = [...currentLayers.slice(0, index)];
      if (connectionId)
        newLayers[index] = { type: "connection_only", connectionId };
      const newSearchParams = dataToSearchParams<"journal">({
        ...currParams,
        layers: newLayers,
      });
      navigate({ search: newSearchParams });
    },
    [navigate, topLayerIndex]
  );

  const setTopLayer = useCallback(
    (layer?: URLLayer) => {
      if (layers.length && layers[topLayerIndex].type === "ConnectionOnly") {
        setLayer(topLayerIndex, layer);
      } else {
        setLayer(topLayerIndex + 1, layer);
      }
    },
    [layers, setLayer, topLayerIndex]
  );

  const setTopConnection = useCallback(
    (connectionId?: string) => {
      if (layers[topLayerIndex].type === "ConnectionOnly") {
        setConnection(topLayerIndex, connectionId);
      } else {
        setConnection(topLayerIndex + 1, connectionId);
      }
    },
    [layers, setConnection, topLayerIndex]
  );

  useEffect(() => {
    if (urlLayers.length === 0) {
      setTopLayer({ type: "daily_journal" });
    }
  }, [setTopLayer, urlLayers.length]);

  return (
    <DiptychContext.Provider
      value={{
        layers,
        layersBySide,
        topLayerIndex,
        setLayer,
        setConnection,
        setTopLayer,
        setTopConnection,
      }}
    >
      {children}
    </DiptychContext.Provider>
  );
};
