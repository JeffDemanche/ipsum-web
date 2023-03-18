import React, { useCallback, useMemo } from "react";
import { useNavigate } from "react-router";
import { dataToSearchParams, URLLayer, urlToData } from "util/url";
import { Diptych, DiptychLayer } from "./types";

export const DiptychContext = React.createContext<Diptych>({
  layers: [{ type: "DailyJournal" }],
  layersBySide: { 0: [], 1: [] },
  topLayerIndex: 0,
  pushLayer: () => {},
  setFirstLayer: () => {},
  closeLayer: () => {},
  openArcDetail: () => {},
});

interface DiptychProviderProps {
  children: React.ReactNode;
}

export const DiptychProvider: React.FunctionComponent<DiptychProviderProps> = ({
  children,
}) => {
  const navigate = useNavigate();

  const urlData = urlToData<"journal">(window.location.href);

  const urlLayers = useMemo(() => urlData.layers ?? [], [urlData.layers]);

  const layers: DiptychLayer[] = useMemo(() => {
    return [
      { type: "DailyJournal" },
      ...urlLayers.map(
        (urlLayer): DiptychLayer => ({
          type: "ArcDetail",
          arcId: urlLayer.objectId,
          diptychMedian: {
            connectionId: urlLayer.connectionId,
          },
        })
      ),
    ];
  }, [urlLayers]);

  const layersBySide = useMemo(() => {
    return {
      0: layers.filter((l, i) => i % 2 === 0),
      1: layers.filter((l, i) => i % 2 !== 0),
    };
  }, [layers]);

  const topLayerIndex = layers.length - 1;

  const pushLayer = useCallback(
    (layer: URLLayer) => {
      const currParams = urlToData<"journal">(window.location.href);
      const newSearchParams = dataToSearchParams<"journal">({
        ...currParams,
        layers: [...currParams.layers, layer],
      });
      navigate({ search: newSearchParams });
    },
    [navigate]
  );

  const setFirstLayer = useCallback(
    (layer: URLLayer) => {
      const currParams = urlToData<"journal">(window.location.href);
      const newSearchParams = dataToSearchParams<"journal">({
        ...currParams,
        layers: [layer],
      });
      navigate({ search: newSearchParams });
    },
    [navigate]
  );

  const closeLayer = useCallback(
    (index: number, keepConnection?: boolean) => {
      const currParams = urlToData<"journal">(window.location.href);

      const newLayers = currParams.layers.slice(0, index - 1);

      if (keepConnection) {
        const closedLayer = { ...currParams.layers[index - 1] };
        delete closedLayer.objectId;
        newLayers.push(closedLayer);
      }

      const newSearchParams = dataToSearchParams<"journal">({
        ...currParams,
        layers: newLayers,
      });
      navigate({ search: newSearchParams });
    },
    [navigate]
  );

  const openArcDetail = useCallback(
    (index: number, arcId: string) => {
      const currParams = urlToData<"journal">(window.location.href);
      const newSearchParams = dataToSearchParams<"journal">({
        ...currParams,
        layers: [
          ...currParams.layers.slice(0, index - 1),
          { type: "arc_detail", objectId: arcId },
        ],
      });
      navigate({ search: newSearchParams });
    },
    [navigate]
  );

  return (
    <DiptychContext.Provider
      value={{
        layers,
        layersBySide,
        topLayerIndex,
        pushLayer,
        setFirstLayer,
        closeLayer,
        openArcDetail,
      }}
    >
      {children}
    </DiptychContext.Provider>
  );
};
