import { useStateDocumentQuery, Document } from "state/in-memory";

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
  const { data: arcs } = useStateDocumentQuery({
    collection: "arc",
    name: "arc search",
  });

  const allArcs = Object.values(arcs).filter((arc) => {
    return arc.name.toLowerCase().includes(query.toLowerCase());
  });

  return { returnedArcs: allArcs.slice(0, maxResults) };
};
