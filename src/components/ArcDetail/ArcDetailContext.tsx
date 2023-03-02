import React from "react";
import { useStateDocumentQuery } from "state/in-memory";
import { ArcDetailContextValue } from "./types";

export const ArcDetailContext = React.createContext<ArcDetailContextValue>({
  arc: undefined,
  highlight: undefined,
});

interface ArcDetailProviderProps {
  assignmentId: string;
  children: React.ReactNode;
}

export const ArcDetailProvider: React.FunctionComponent<
  ArcDetailProviderProps
> = ({ assignmentId, children }) => {
  const { data: highlightData } = useStateDocumentQuery({
    collection: "highlight",
    keys: [assignmentId],
  });

  const arcId = highlightData[assignmentId]?.arcId;

  const { data: arcData } = useStateDocumentQuery({
    collection: "arc",
    keys: [arcId],
  });

  const highlight = highlightData[assignmentId];
  const arc = arcData[arcId];

  const loading = !highlight || !arc;

  return (
    <ArcDetailContext.Provider value={{ arc, highlight }}>
      {loading ? "Loading..." : children}
    </ArcDetailContext.Provider>
  );
};
