import React from "react";
import { useStateDocumentQuery } from "state/in-memory";
import { ArcDetailContextValue } from "./types";

export const ArcDetailContext = React.createContext<ArcDetailContextValue>({
  arc: undefined,
  assignment: undefined,
});

interface ArcDetailProviderProps {
  assignmentId: string;
  children: React.ReactNode;
}

export const ArcDetailProvider: React.FunctionComponent<
  ArcDetailProviderProps
> = ({ assignmentId, children }) => {
  const { data: arcAssignmentData } = useStateDocumentQuery({
    collection: "arc_assignment",
    keys: [assignmentId],
  });

  const arcId = arcAssignmentData[assignmentId]?.arcId;

  const { data: arcData } = useStateDocumentQuery({
    collection: "arc",
    keys: [arcId],
  });

  const assignment = arcAssignmentData[assignmentId];
  const arc = arcData[arcId];

  const loading = !assignment || !arc;

  return (
    <ArcDetailContext.Provider value={{ arc, assignment }}>
      {loading ? "Loading..." : children}
    </ArcDetailContext.Provider>
  );
};
