/**
 * Provides functionality for keeping track of Highlight selection, hovering,
 * and other abilities across components.
 */

import { useQuery } from "@apollo/client";
import React, { useCallback, useState } from "react";
import { gql } from "util/apollo";
import { urlToData, useModifySearchParams } from "util/url";

interface HighlightSelectionContextValue {
  hoveredHighlightIds: string[] | undefined;
  setHoveredHighlightIds: React.Dispatch<React.SetStateAction<string[]>>;

  selectedHighlightId: string | undefined;
  setSelectedHighlightId: (
    highlight: string,
    layerIndex: number,
    entryKey?: string
  ) => void;

  ambiguouslySelectedHighlightIds: string[] | undefined;
  setAmbiguouslySelectedHighlightIds: React.Dispatch<
    React.SetStateAction<string[]>
  >;
}

const defaultHighlightSelectionContext: HighlightSelectionContextValue = {
  hoveredHighlightIds: undefined,
  setHoveredHighlightIds: () => {},
  selectedHighlightId: undefined,
  setSelectedHighlightId: () => {},
  ambiguouslySelectedHighlightIds: undefined,
  setAmbiguouslySelectedHighlightIds: () => {},
};

export const HighlightSelectionContext =
  React.createContext<HighlightSelectionContextValue>(
    defaultHighlightSelectionContext
  );

interface HighlightSelectionProviderProps {
  children: React.ReactNode;
}

const HighlightSelectionProviderQuery = gql(`
  query HighlightSelectionProvider($highlightId: ID!) {
    highlight(id: $highlightId) {
      id
    }
  }
`);

export const HighlightSelectionProvider: React.FC<
  HighlightSelectionProviderProps
> = ({ children }) => {
  const modifySearchParams = useModifySearchParams<"journal">();

  const { data } = useQuery(HighlightSelectionProviderQuery, {
    variables: {
      highlightId: urlToData<"journal">(window.location.href).highlight,
    },
    skip: !urlToData<"journal">(window.location.href).highlight,
  });

  const selectedHighlight = data?.highlight;

  const selectedHighlightId = selectedHighlight?.id;

  const setSelectedHighlightId = useCallback(
    (highlight: string, layerIndex: number, entryKey?: string) => {
      modifySearchParams((searchParams) => {
        return {
          ...searchParams,
          layers: [
            ...searchParams.layers.slice(0, -1),
            {
              ...searchParams.layers[layerIndex],
              highlightFrom: highlight,
              highlightFromUrlDate: entryKey,
            },
          ],
          // TODO
          searchResults: { and: [{ or: [{}] }] },
          highlight,
        };
      });
    },
    [modifySearchParams]
  );

  const [hoveredHighlightIds, setHoveredHighlightIds] =
    useState<string[]>(undefined);

  const [ambiguouslySelectedHighlightIds, setAmbiguouslySelectedHighlightIds] =
    useState(undefined);

  return (
    <HighlightSelectionContext.Provider
      value={{
        hoveredHighlightIds,
        setHoveredHighlightIds,
        selectedHighlightId,
        setSelectedHighlightId,
        ambiguouslySelectedHighlightIds,
        setAmbiguouslySelectedHighlightIds,
      }}
    >
      {children}
    </HighlightSelectionContext.Provider>
  );
};
