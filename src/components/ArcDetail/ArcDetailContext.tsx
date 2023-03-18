import React from "react";
import { useStateDocumentQuery } from "state/in-memory";
import { ArcDetailContextValue } from "./types";

export const ArcDetailContext = React.createContext<ArcDetailContextValue>({
  arc: undefined,
  incomingHighlight: undefined,
});

interface ArcDetailProviderProps {
  arcId: string;
  incomingHighlightId?: string;
  children: React.ReactNode;
}

export const ArcDetailProvider: React.FunctionComponent<
  ArcDetailProviderProps
> = ({ arcId, incomingHighlightId, children }) => {
  const { data: arcData } = useStateDocumentQuery({
    collection: "arc",
    keys: [arcId],
  });

  const { data: incomingHighlightData } = useStateDocumentQuery({
    collection: "highlight",
    keys: [incomingHighlightId],
  });

  const arc = arcData[arcId];
  const incomingHighlight = incomingHighlightData[incomingHighlightId];

  const loading = !arc;

  return (
    <ArcDetailContext.Provider value={{ arc, incomingHighlight }}>
      {loading ? "Loading..." : children}
    </ArcDetailContext.Provider>
  );
};
