import { useQuery } from "@apollo/client";
import { gql } from "util/apollo";

interface UseSearchArcsParams {
  skip?: boolean;
  query: string;
  maxResults?: number;
}

interface UseSearchArcsReturn {
  returnedArcs: { id: string; name: string; color: number }[];
}

export const UseSearchArcsQuery = gql(`
  query UseSearchArcs {
    arcs {
      id
      name
      color
    }
  }
`);

export const useSearchArcs = ({
  skip,
  query,
  maxResults = 10,
}: UseSearchArcsParams): UseSearchArcsReturn => {
  const { data } = useQuery(UseSearchArcsQuery, { skip });

  if (skip || !data) return { returnedArcs: [] };

  const allArcs = Object.values(data?.arcs).filter((arc) => {
    return arc.name.toLowerCase().includes(query.toLowerCase());
  });

  return { returnedArcs: allArcs.slice(0, maxResults) };
};
