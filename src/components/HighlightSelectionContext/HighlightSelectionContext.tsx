/**
 * Provides functionality for keeping track of Highlight selection, hovering,
 * and other abilities across components.
 */

import React, { useCallback, useContext, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { InMemoryStateContext } from "state/in-memory";
import { dataToSearchParams, urlToData } from "util/url";

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

export const HighlightSelectionProvider: React.FC<
  HighlightSelectionProviderProps
> = ({ children }) => {
  const navigate = useNavigate();

  const location = useLocation();

  const { state } = useContext(InMemoryStateContext);

  const selectedHighlightIds = useMemo(
    () =>
      urlToData<"journal">(window.location.href).highlight?.filter(
        (highlightId) => !!state.highlight[highlightId]
      ),
    [state, location]
  );

  const setSelectedHighlightIds = useCallback(
    (highlights: string[]) => {
      const newParams = dataToSearchParams<"journal">({
        highlight: highlights,
      });
      navigate({ search: newParams }, { replace: false });
    },
    [navigate]
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
