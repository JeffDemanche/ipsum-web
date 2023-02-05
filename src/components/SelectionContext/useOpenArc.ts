import { useContext } from "react";
import { useStateDocumentQuery } from "state/in-memory";
import { ArcSelectionContext } from "./ArcSelectionContext";

export const useOpenArc = () => {
  const { openArcId } = useContext(ArcSelectionContext);
  const { data: arcs } = useStateDocumentQuery({
    collection: "arc",
    name: "open arc",
  });

  if (!arcs[openArcId]) {
    return { isOpen: false };
  }

  return { isOpen: true, openArcId, arc: arcs[openArcId] };
};
