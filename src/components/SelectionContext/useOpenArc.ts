import { InMemoryStateContext } from "components/InMemoryStateContext/InMemoryStateContext";
import { useContext } from "react";
import { ArcSelectionContext } from "./ArcSelectionContext";

export const useOpenArc = () => {
  const { openArcId } = useContext(ArcSelectionContext);
  const { state } = useContext(InMemoryStateContext);

  if (!state.arcs[openArcId]) {
    return { isOpen: false };
  }

  return { isOpen: true, openArcId, arc: state.arcs[openArcId] };
};
