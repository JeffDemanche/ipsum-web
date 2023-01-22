import { useStateDocumentQuery } from "state/in-memory";
import { InMemoryArc } from "state/in-memory/in-memory-state";

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
  const { data: arcs } = useStateDocumentQuery({ collection: "arc", keys: [] });

  const allArcs = Object.values(arcs).filter((arc) => {
    return arc.name.toLowerCase().includes(query.toLowerCase());
  });

  return { returnedArcs: allArcs.slice(0, maxResults) };
};
