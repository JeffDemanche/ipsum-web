import React, { useCallback, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { IpsumURL, URLLayer } from "util/url";
import { Diptych, DiptychLayer } from "./types";

export const DiptychContext = React.createContext<Diptych>({
  layers: [{ type: "DailyJournal" }],
  layersBySide: { 0: [], 1: [] },
  pushLayer: () => {},
  setFirstLayer: () => {},
  closeLayer: () => {},
});

interface DiptychProviderProps {
  children: React.ReactNode;
}

export const DiptychProvider: React.FunctionComponent<DiptychProviderProps> = ({
  children,
}) => {
  const location = useLocation();
  const navigate = useNavigate();

  const urlLayers = useMemo(
    () =>
      new IpsumURL(new URL(window.location.href)).getJournalUrl().getLayers(),
    [location]
  );

  const layers: DiptychLayer[] = useMemo(() => {
    return [
      { type: "DailyJournal" },
      ...urlLayers.map(
        (urlLayer): DiptychLayer => ({
          type: "ArcDetail",
          connectionFrom: {},
          arcId: urlLayer.objectId,
          assignmentId: urlLayer.connectionId,
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

  const pushLayer = useCallback((layer: URLLayer) => {
    const url = new IpsumURL(new URL(window.location.href))
      .getJournalUrl()
      .pushLayer(layer);
    navigate(url.url);
  }, []);

  const setFirstLayer = useCallback((layer: URLLayer) => {
    const url = new IpsumURL(new URL(window.location.href))
      .getJournalUrl()
      .setTopLayer(1, layer);
    navigate(url.url);
  }, []);

  const closeLayer = useCallback((index: number) => {
    const url = new IpsumURL(new URL(window.location.href))
      .getJournalUrl()
      .setTopLayer(index - 1);
    navigate(url.url);
  }, []);

  return (
    <DiptychContext.Provider
      value={{
        layers,
        layersBySide,
        pushLayer,
        setFirstLayer,
        closeLayer,
      }}
    >
      {children}
    </DiptychContext.Provider>
  );
};
