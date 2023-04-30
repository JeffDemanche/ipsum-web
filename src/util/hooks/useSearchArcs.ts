import { useQuery } from "@apollo/client";
import { gql } from "util/apollo";

interface UseSearchArcsParams {
  query: string;
  maxResults?: number;
}

interface UseSearchArcsReturn {
  returnedArcs: { id: string; name: string; color: number }[];
}

const UseSearchArcsQuery = gql(`
  query UseSearchArcs {
    arcs {
      id
      name
      color
    }
  }
`);

export const useSearchArcs = ({
  query,
  maxResults = 10,
}: UseSearchArcsParams): UseSearchArcsReturn => {
  const {
    data: { arcs },
  } = useQuery(UseSearchArcsQuery);

  const allArcs = Object.values(arcs).filter((arc) => {
    return arc.name.toLowerCase().includes(query.toLowerCase());
  });

  return { returnedArcs: allArcs.slice(0, maxResults) };
};
