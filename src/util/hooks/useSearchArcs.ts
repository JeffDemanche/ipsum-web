import { useContext } from "react";
import { InMemoryArc } from "state/in-memory/in-memory-state";
import { InMemoryStateContext } from "components/InMemoryStateContext/InMemoryStateContext";

interface UseSearchArcsParams {
  query: string;
  maxResults?: number;
}

interface UseSearchArcsReturn {
  returnedArcs: InMemoryArc[];
}

export const useSearchArcs = ({
  query,
  maxResults = 10,
}: UseSearchArcsParams): UseSearchArcsReturn => {
  const {
    state: { arcs },
  } = useContext(InMemoryStateContext);

  const allArcs = Object.values(arcs).filter((arc) => {
    return arc.name.toLowerCase().includes(query.toLowerCase());
  });

  return { returnedArcs: allArcs.slice(0, maxResults) };
};
