import { useQuery } from "@apollo/client";
import { useMemo } from "react";
import { gql } from "util/apollo";
import { compareDatesDesc, IpsumDateTime } from "util/dates";
import { HighlightSearch } from "./types";

interface UseHighlightSearchArgs {
  highlightId: string;
  // TODO
  criteria?: HighlightSearch;
}

interface UseHighlightSearchResults {
  searchResults: { id: string }[];
}

export const UseHighlightSearchQuery = gql(`
  query UseHighlightSearch($highlightId: ID!) {
    highlight(id: $highlightId) {
      id
      outgoingRelations {
        id
        predicate
        object {
          id
          incomingRelations {
            id
            predicate
            subject {
              __typename
              ... on Highlight {
                id
                entry {
                  entryKey
                  date
                }
              }
            }
          }
        }
      }
    }
  }
`);

export const useHighlightSearch = (
  args: UseHighlightSearchArgs
): UseHighlightSearchResults => {
  const { data } = useQuery(UseHighlightSearchQuery, {
    variables: { highlightId: args.highlightId },
  });

  const allHighlights = useMemo(() => {
    const highlights = new Set<{
      id: string;
      entry: { entryKey: string; date: string };
    }>();

    data?.highlight?.outgoingRelations.forEach((highlightOutgoingRelation) => {
      const arc = highlightOutgoingRelation.object;
      arc.incomingRelations.forEach((arcIncomingRelation) => {
        if (arcIncomingRelation.subject.__typename === "Highlight")
          highlights.add(arcIncomingRelation.subject);
      });
    });

    return highlights;
  }, [data?.highlight?.outgoingRelations]);

  const sortedResults =
    allHighlights &&
    Object.values([...allHighlights]).sort((a, b) =>
      compareDatesDesc(
        IpsumDateTime.fromString(a.entry.entryKey, "entry-printed-date"),
        IpsumDateTime.fromString(b.entry.entryKey, "entry-printed-date")
      )
    );

  return {
    searchResults: sortedResults,
  };
};
