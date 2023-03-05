/**
 * Provides functionality for keeping track of Highlight selection, hovering,
 * and other abilities across components.
 */

import React, { useCallback, useState } from "react";
import { useNavigate } from "react-router";
import { useSearchParams } from "react-router-dom";

interface HighlightSelectionContextValue {
  hoveredHighlightIds: string[] | undefined;
  setHoveredHighlightIds: (highlightId: string[]) => void;

  selectedHighlightIds: string[] | undefined;
  setSelectedHighlightIds: (highlightIds: string[]) => void;
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

export const HighlightSelectionProvider: React.FC<
  HighlightSelectionProviderProps
> = ({ children }) => {
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();

  const selectedHighlightIds = searchParams.has("highlight")
    ? searchParams.get("highlight").split(",")
    : undefined;

  const setSelectedHighlightIds = useCallback(
    (highlights: string[]) => {
      const newParams = new URLSearchParams(searchParams);
      newParams.set("highlight", highlights.join(","));
      navigate({ search: newParams.toString() }, { replace: false });
    },
    [navigate, searchParams]
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
