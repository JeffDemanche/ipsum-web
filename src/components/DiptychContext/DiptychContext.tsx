import { BreadcrumbType } from "components/Breadcrumb";
import React, { useCallback, useEffect, useMemo } from "react";
import { IpsumDateTime, IpsumDay } from "util/dates";
import {
  HighlightDetailURLLayer,
  URLLayer,
  useIpsumSearchParams,
  useModifySearchParams,
} from "util/state/url";

import { Diptych } from "./types";

const isIdenticalLayer = (a: URLLayer, b: URLLayer) => {
  if (a.type !== b.type) {
    return false;
  }

  if (a.type === "daily_journal" && b.type === "daily_journal") {
    return a.focusedDate === b.focusedDate;
  }

  if (a.type === "arc_detail" && b.type === "arc_detail") {
    return a.arcId === b.arcId;
  }

  if (a.type === "highlight_detail" && b.type === "highlight_detail") {
    return a.highlightId === b.highlightId;
  }

  return false;
};

export const DiptychContext = React.createContext<Diptych>({
  layers: [],
  pushLayer: () => {},
  popLayer: () => {},
  orderedBreadcrumbs: [],
  popHighlights: () => {},
  selectedHighlightId: undefined,
  topLayer: undefined,
  setSelectedHighlightId: () => {},
  sort: "importance",
  setSort: () => {},
});

interface DiptychProviderProps {
  children: React.ReactNode;
}

export const DiptychProvider: React.FunctionComponent<DiptychProviderProps> = ({
  children,
}) => {
  const { layers, sort, highlight } = useIpsumSearchParams<"journal">();

  /**
   * Equivalent to the hightlightFrom on the topmost layer.
   */
  const selectedHighlightId = useMemo(() => highlight, [highlight]);

  const urlLayers = useMemo(() => layers ?? [], [layers]);

  const modifySearchParams = useModifySearchParams<"journal">();

  const pushLayer = useCallback(
    (layer: URLLayer) => {
      if (urlLayers.length > 0) {
        const topLayer = urlLayers[urlLayers.length - 1];
        if (isIdenticalLayer(topLayer, layer)) {
          return;
        }
      }

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

  const breadcrumbForLayer = useCallback(
    (layer: URLLayer, visible: boolean): BreadcrumbType => {
      switch (layer.type) {
        case "daily_journal":
          return {
            type: "journal_entry",
            journalEntryId: selectedHighlightId
              ? IpsumDay.fromString(
                  selectedHighlightId,
                  "entry-printed-date"
                ).toString("stored-day")
              : layer.focusedDate
                ? IpsumDateTime.fromString(
                    layer.focusedDate,
                    "url-format"
                  ).toString("entry-printed-date")
                : IpsumDay.today().toString("entry-printed-date"),
            visible,
          };
        case "arc_detail":
          return {
            type: "arc",
            arcId: layer.arcId,
            visible,
          };
        case "highlight_detail":
          return {
            type: "highlight",
            highlightId: layer.highlightId,
            visible,
          };
      }
    },
    [selectedHighlightId]
  );

  const orderedBreadcrumbs = useMemo(() => {
    const breadcrumbs: BreadcrumbType[] = [];

    urlLayers.forEach((layer, i) => {
      const layerVisible =
        i === urlLayers.length - 1 || i === urlLayers.length - 2;

      breadcrumbs.push(breadcrumbForLayer(layer, layerVisible));
    });

    return breadcrumbs;
  }, [breadcrumbForLayer, urlLayers]);

  const popHighlights = useCallback(() => {
    if (urlLayers[urlLayers.length - 1]?.type === "highlight_detail") {
      modifySearchParams((searchParams) => {
        const topLayer = {
          ...searchParams.layers[searchParams.layers.length - 1],
        };
        return {
          ...searchParams,
          layers: [...searchParams.layers.slice(0, -1), topLayer],
        };
      });
    }
  }, [modifySearchParams, urlLayers]);

  useEffect(() => {
    if (urlLayers.length === 0) {
      pushLayer({ type: "daily_journal" });
    }
  }, [pushLayer, urlLayers.length]);

  const setSelectedHighlightId = useCallback(
    (highlightId: string) => {
      const newLayer: HighlightDetailURLLayer = {
        type: "highlight_detail",
        highlightId,
      };
      if (highlightId === undefined) {
        modifySearchParams((searchParams) => {
          const newUrlLayers = [...urlLayers];
          newUrlLayers.pop();
          return {
            ...searchParams,
            layers: newUrlLayers,
            highlight: undefined,
          };
        });
      } else if (
        urlLayers.length === 0 ||
        urlLayers[urlLayers.length - 1]?.type === "highlight_detail"
      ) {
        modifySearchParams((searchParams) => {
          const newUrlLayers = [...urlLayers];
          newUrlLayers.pop();
          newUrlLayers.push(newLayer);
          return {
            ...searchParams,
            layers: newUrlLayers,
            highlight: highlightId,
          };
        });
      } else {
        if (urlLayers.length > 0) {
          const topLayer = urlLayers[urlLayers.length - 1];
          if (isIdenticalLayer(topLayer, newLayer)) {
            return;
          }
        }

        modifySearchParams((searchParams) => {
          const newUrlLayers = [...urlLayers, newLayer];
          return {
            ...searchParams,
            layers: newUrlLayers,
            highlight: highlightId,
          };
        });
      }
    },
    [modifySearchParams, urlLayers]
  );

  const setSort = useCallback(
    (sort: "importance" | "date") => {
      modifySearchParams((searchParams) => {
        return {
          ...searchParams,
          sort,
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
        popHighlights,
        selectedHighlightId,
        setSelectedHighlightId,
        sort: sort ?? "importance",
        setSort,
      }}
    >
      {children}
    </DiptychContext.Provider>
  );
};
