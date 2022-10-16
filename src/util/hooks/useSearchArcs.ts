import { useContext } from "react";
import { InMemoryArc } from "state/in-memory/in-memory-state";
import { InMemoryStateContext } from "state/in-memory/InMemoryStateProvider";

interface UseSearchArcsReturn {
  returnedArcs: InMemoryArc[];
}

export const useSearchArcs = (query: string): UseSearchArcsReturn => {
  const {
    state: { arcs },
  } = useContext(InMemoryStateContext);

  const allArcs = Object.values(arcs).filter((arc) => {
    return arc.name.toLowerCase().includes(query.toLowerCase());
  });

  return { returnedArcs: allArcs };
};
