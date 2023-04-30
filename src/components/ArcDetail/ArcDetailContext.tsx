import React from "react";
import { ArcDetailContextValue } from "./types";

export const ArcDetailContext = React.createContext<ArcDetailContextValue>({
  arcId: undefined,
  incomingHighlightId: undefined,
});

interface ArcDetailProviderProps {
  arcId: string;
  incomingHighlightId?: string;
  children: React.ReactNode;
}

export const ArcDetailProvider: React.FunctionComponent<
  ArcDetailProviderProps
> = ({ arcId, incomingHighlightId, children }) => {
  return (
    <ArcDetailContext.Provider value={{ arcId, incomingHighlightId }}>
      {children}
    </ArcDetailContext.Provider>
  );
};
