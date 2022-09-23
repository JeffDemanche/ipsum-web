/**
 * Provides functionality for keeping track of Arc selection, hovering, and
 * other abilities across components.
 */

import React, { useState } from "react";

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
  const [hoveredArcIds, setHoveredArcIds] = useState<string[]>(undefined);
  const [selectedArcIds, setSelectedArcIds] = useState<string[]>(undefined);

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
