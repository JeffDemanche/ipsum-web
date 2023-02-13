/**
 * Provides functionality for keeping track of Arc selection, hovering, and
 * other abilities across components.
 */

import React, { useCallback, useState } from "react";
import { useNavigate } from "react-router";
import { useSearchParams } from "react-router-dom";

interface ArcSelectionContextValue {
  hoveredArcIds: string[] | undefined;
  setHoveredArcIds: (arcId: string[]) => void;

  selectedArcIds: string[] | undefined;
  setSelectedArcIds: (arcId: string[]) => void;
}

const defaultArcSelectionContext: ArcSelectionContextValue = {
  hoveredArcIds: undefined,
  setHoveredArcIds: () => {},
  selectedArcIds: undefined,
  setSelectedArcIds: () => {},
};

export const ArcSelectionContext =
  React.createContext<ArcSelectionContextValue>(defaultArcSelectionContext);

interface ArcSelectionProviderProps {
  children: React.ReactNode;
}

export const ArcSelectionProvider: React.FC<ArcSelectionProviderProps> = ({
  children,
}) => {
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();

  const selectedArcIds = searchParams.has("arcs")
    ? searchParams.get("arcs").split(",")
    : [];

  const setSelectedArcIds = useCallback(
    (arcs: string[]) => {
      const newParams = new URLSearchParams(searchParams);
      newParams.set("arcs", arcs.join(","));
      navigate({ search: newParams.toString() }, { replace: false });
    },
    [navigate, searchParams]
  );

  const [hoveredArcIds, setHoveredArcIds] = useState<string[]>(undefined);

  return (
    <ArcSelectionContext.Provider
      value={{
        hoveredArcIds,
        setHoveredArcIds,
        selectedArcIds,
        setSelectedArcIds,
      }}
    >
      {children}
    </ArcSelectionContext.Provider>
  );
};
