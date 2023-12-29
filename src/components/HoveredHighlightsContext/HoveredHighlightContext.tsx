/**
 * Provides functionality for keeping track of Highlight selection, hovering,
 * and other abilities across components.
 */
import React, { useState } from "react";

interface HighlightSelectionContextValue {
  hoveredHighlightIds: string[] | undefined;
  setHoveredHighlightIds: React.Dispatch<React.SetStateAction<string[]>>;
}

const defaultHoveredHighlightsContext: HighlightSelectionContextValue = {
  hoveredHighlightIds: undefined,
  setHoveredHighlightIds: () => {},
};

export const HoveredHighlightsContext =
  React.createContext<HighlightSelectionContextValue>(
    defaultHoveredHighlightsContext
  );

interface HighlightSelectionProviderProps {
  children: React.ReactNode;
}

export const HoveredHighlightsProvider: React.FC<
  HighlightSelectionProviderProps
> = ({ children }) => {
  const [hoveredHighlightIds, setHoveredHighlightIds] =
    useState<string[]>(undefined);

  return (
    <HoveredHighlightsContext.Provider
      value={{
        hoveredHighlightIds,
        setHoveredHighlightIds,
      }}
    >
      {children}
    </HoveredHighlightsContext.Provider>
  );
};
