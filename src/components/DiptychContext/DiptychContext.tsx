import React, { useCallback, useEffect, useMemo } from "react";
import { useLocation } from "react-router";
import { URLLayer, urlToData, useModifySearchParams } from "util/url";
import { Breadcrumb, Diptych } from "./types";

export const DiptychContext = React.createContext<Diptych>({
  layers: [],
  pushLayer: () => {},
  orderedBreadcrumbs: [],
});

interface DiptychProviderProps {
  children: React.ReactNode;
}

export const DiptychProvider: React.FunctionComponent<DiptychProviderProps> = ({
  children,
}) => {
  const location = useLocation();
  const urlData = useMemo(
    () => urlToData<"journal">(window.location.href),
    [location]
  );

  const urlLayers = useMemo(() => urlData.layers ?? [], [urlData.layers]);

  const modifySearchParams = useModifySearchParams<"journal">();

  const pushLayer = useCallback(
    (layer: URLLayer) => {
      modifySearchParams((searchParams) => {
        const newUrlLayers = [...urlLayers, layer];
        return {
          ...searchParams,
          layers: newUrlLayers,
        };
      });
    },
    [modifySearchParams, urlLayers]
  );

  const breadcrumbForLayer = useCallback((layer: URLLayer): Breadcrumb => {
    switch (layer.type) {
      case "daily_journal":
        return {
          type: "journal_entry",
          journalEntryId: layer.highlightFromEntryKey,
        };
      case "arc_detail":
        return {
          type: "arc",
          arcId: layer.arcId,
        };
    }
  }, []);

  const orderedBreadcrumbs = useMemo(() => {
    const breadcrumbs: Breadcrumb[] = [];

    urlLayers.forEach((layer) => {
      breadcrumbs.push(breadcrumbForLayer(layer));

      if (layer.highlightFrom) {
        breadcrumbs.push({
          type: "highlight",
          highlightId: layer.highlightFrom,
        });

        if (layer.highlightTo) {
          breadcrumbs.push({
            type: "highlight",
            highlightId: layer.highlightTo,
          });
        }
      }
    });

    breadcrumbs.pop();

    return breadcrumbs;
  }, [breadcrumbForLayer, urlLayers]);

  useEffect(() => {
    if (urlLayers.length === 0) {
      pushLayer({ type: "daily_journal" });
    }
  }, [pushLayer, urlLayers.length]);

  return (
    <DiptychContext.Provider
      value={{
        layers: urlLayers,
        pushLayer,
        orderedBreadcrumbs,
      }}
    >
      {children}
    </DiptychContext.Provider>
  );
};
