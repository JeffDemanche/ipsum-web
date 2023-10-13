import React, { useCallback, useEffect, useMemo } from "react";
import { IpsumDay } from "util/dates";
import {
  URLLayer,
  useIpsumSearchParams,
  useModifySearchParams,
} from "util/url";
import { Breadcrumb, Diptych } from "./types";

export const DiptychContext = React.createContext<Diptych>({
  layers: [],
  pushLayer: () => {},
  orderedBreadcrumbs: [],
  setTopHighlightFrom: () => {},
  setTopHighlightTo: () => {},
  selectedHighlightId: undefined,
  topLayer: undefined,
});

interface DiptychProviderProps {
  children: React.ReactNode;
}

export const DiptychProvider: React.FunctionComponent<DiptychProviderProps> = ({
  children,
}) => {
  const urlData = useIpsumSearchParams<"journal">();

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
          journalEntryId: layer.highlightFromEntryKey
            ? IpsumDay.fromString(
                layer.highlightFromEntryKey,
                "entry-printed-date"
              ).toString("stored-day")
            : undefined,
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

  const setTopHighlightFrom = useCallback(
    (highlightFrom: string, highlightFromEntryKey: string) => {
      modifySearchParams((searchParams) => ({
        ...searchParams,
        layers: [
          ...searchParams.layers.slice(0, -1),
          {
            ...searchParams.layers[searchParams.layers.length - 1],
            highlightFrom,
            highlightFromEntryKey,
            highlightTo: undefined,
            highlightToEntryKey: undefined,
          },
        ],
      }));
    },
    [modifySearchParams]
  );

  const setTopHighlightTo = useCallback(
    (highlightTo: string, highlightToEntryKey: string) => {
      modifySearchParams((searchParams) => {
        if (
          !searchParams.layers[searchParams.layers.length - 1].highlightFrom
        ) {
          throw new Error(
            "Don't set highlightTo when highlightFrom is not set"
          );
        }

        return {
          ...searchParams,
          layers: [
            ...searchParams.layers.slice(0, -1),
            {
              ...searchParams.layers[searchParams.layers.length - 1],
              highlightTo,
              highlightToEntryKey,
            },
          ],
        };
      });
    },
    [modifySearchParams]
  );

  /**
   * Equivalent to the hightlightFrom on the topmost layer.
   */
  const selectedHighlightId = useMemo(() => {
    const topLayer = urlLayers[urlLayers.length - 1];
    return topLayer?.highlightFrom;
  }, [urlLayers]);

  useEffect(() => {
    if (urlLayers.length === 0) {
      pushLayer({ type: "daily_journal" });
    }
  }, [pushLayer, urlLayers.length]);

  return (
    <DiptychContext.Provider
      value={{
        layers: urlLayers,
        topLayer: urlLayers[urlLayers.length - 1],
        pushLayer,
        orderedBreadcrumbs,
        setTopHighlightFrom,
        setTopHighlightTo,
        selectedHighlightId,
      }}
    >
      {children}
    </DiptychContext.Provider>
  );
};
