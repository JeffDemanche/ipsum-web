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

  selectedHighlightIds: string[] | undefined;
  setSelectedHighlightIds: React.Dispatch<React.SetStateAction<string[]>>;
}

const defaultHighlightSelectionContext: HighlightSelectionContextValue = {
  hoveredHighlightIds: undefined,
  setHoveredHighlightIds: () => {},
  selectedHighlightIds: undefined,
  setSelectedHighlightIds: () => {},
};

export const HighlightSelectionContext =
  React.createContext<HighlightSelectionContextValue>(
    defaultHighlightSelectionContext
  );

interface HighlightSelectionProviderProps {
  children: React.ReactNode;
}

const HighlightSelectionProviderQuery = gql(`
  query HighlightSelectionProvider($highlightIds: [ID!]) {
    highlights(ids: $highlightIds) {
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
      highlightIds: urlToData<"journal">(window.location.href).highlight,
    },
    skip: !urlToData<"journal">(window.location.href).highlight,
  });

  const selectedHighlights = data?.highlights ?? [];

  const selectedHighlightIds = selectedHighlights?.map(
    (highlight) => highlight.id
  );

  const setSelectedHighlightIds = useCallback(
    (highlights: string[]) => {
      modifySearchParams((searchParams) => {
        return { ...searchParams, highlight: highlights };
      });
    },
    [modifySearchParams]
  );

  const [hoveredHighlightIds, setHoveredHighlightIds] =
    useState<string[]>(undefined);

  return (
    <HighlightSelectionContext.Provider
      value={{
        hoveredHighlightIds,
        setHoveredHighlightIds,
        selectedHighlightIds,
        setSelectedHighlightIds,
      }}
    >
      {children}
    </HighlightSelectionContext.Provider>
  );
};
