import { useStateDocumentQuery } from "state/in-memory";
import { Document } from "state/in-memory/in-memory-schema";

interface UseSearchArcsParams {
  query: string;
  maxResults?: number;
}

interface UseSearchArcsReturn {
  returnedArcs: Document<"arc">[];
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
