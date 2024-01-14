import { useQuery } from "@apollo/client";
import React, { useCallback, useEffect, useMemo } from "react";
import { gql } from "util/apollo";
import { IpsumDateTime, IpsumDay } from "util/dates";
import {
  URLLayer,
  useIpsumSearchParams,
  useModifySearchParams,
} from "util/url";
import { Breadcrumb, Diptych } from "./types";

export const DiptychContext = React.createContext<Diptych>({
  layers: [],
  pushLayer: () => {},
  popLayer: () => {},
  orderedBreadcrumbs: [],
  setTopHighlightFrom: () => {},
  setTopHighlightTo: () => {},
  popHighlights: () => {},
  selectedHighlightId: undefined,
  topLayer: undefined,
  setSelectedHighlightId: () => {},
});

interface DiptychProviderProps {
  children: React.ReactNode;
}

const DiptychContextHighlightQuery = gql(`
  query DiptychContextHighlight($highlightId: ID!) {
    highlight(id: $highlightId) {
      id
    }
  }
`);

export const DiptychProvider: React.FunctionComponent<DiptychProviderProps> = ({
  children,
}) => {
  const { layers } = useIpsumSearchParams<"journal">();

  const urlLayers = useMemo(() => layers ?? [], [layers]);

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

  const popLayer = useCallback(() => {
    modifySearchParams((searchParams) => {
      const newUrlLayers = [...urlLayers];
      newUrlLayers.pop();
      return {
        ...searchParams,
        layers: newUrlLayers,
      };
    });
  }, [modifySearchParams, urlLayers]);

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
            : layer.focusedDate
            ? IpsumDateTime.fromString(
                layer.focusedDate,
                "url-format"
              ).toString("entry-printed-date")
            : IpsumDay.today().toString("entry-printed-date"),
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

  const popHighlights = useCallback(() => {
    modifySearchParams((searchParams) => {
      return {
        ...searchParams,
        layers: [
          ...searchParams.layers.slice(0, -1),
          {
            ...searchParams.layers[searchParams.layers.length - 1],
            highlightFrom: undefined,
            highlightFromEntryKey: undefined,
            highlightTo: undefined,
            highlightToEntryKey: undefined,
          },
        ],
      };
    });
  }, [modifySearchParams]);

  // This bit of logic deals with highlight deletion when the highlight is
  // present in the URL.
  const topHighlightFrom = useMemo(
    () => urlLayers[urlLayers.length - 1]?.highlightFrom,
    [urlLayers]
  );

  const { data: topLayerHighlightFrom } = useQuery(
    DiptychContextHighlightQuery,
    {
      variables: {
        // TODO: We need to figure out how to handle deleting highlights with many
        // layers open.
        highlightId: topHighlightFrom,
      },
    }
  );

  const topHighlightTo = useMemo(
    () => urlLayers[urlLayers.length - 1]?.highlightTo,
    [urlLayers]
  );

  const { data: topLayerHighlightTo } = useQuery(DiptychContextHighlightQuery, {
    variables: {
      highlightId: topHighlightTo,
    },
  });

  useEffect(() => {
    if (
      (!topLayerHighlightFrom?.highlight &&
        urlLayers[urlLayers.length - 1]?.highlightFrom) ||
      (!topLayerHighlightTo?.highlight &&
        urlLayers[urlLayers.length - 1]?.highlightTo)
    ) {
      popHighlights();
    }
  }, [popHighlights, topLayerHighlightFrom, topLayerHighlightTo, urlLayers]);

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

  const setSelectedHighlightId = useCallback(
    (highlight: string) => {
      modifySearchParams((searchParams) => {
        const topLayerIndex = searchParams.layers.length - 1;
        return {
          ...searchParams,
          layers: [
            ...searchParams.layers.slice(0, -1),
            {
              ...searchParams.layers[topLayerIndex],
              highlightFrom: highlight,
            },
          ],
          // TODO
          // searchCriteria: { and: [{ or: [{}] }] },
          highlight,
        };
      });
    },
    [modifySearchParams]
  );

  return (
    <DiptychContext.Provider
      value={{
        layers: urlLayers,
        topLayer: urlLayers[urlLayers.length - 1],
        pushLayer,
        popLayer,
        orderedBreadcrumbs,
        setTopHighlightFrom,
        setTopHighlightTo,
        popHighlights,
        selectedHighlightId,
        setSelectedHighlightId,
      }}
    >
      {children}
    </DiptychContext.Provider>
  );
};
