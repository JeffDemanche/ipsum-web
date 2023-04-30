import { useQuery } from "@apollo/client";
import { gql } from "util/apollo";
import { compareDatesDesc, IpsumDateTime } from "util/dates";

interface UseHighlightSearchArgs {
  highlightId: string;
}

interface UseHighlightSearchResults {
  searchResults: { id: string }[];
}

const UseHighlightSearchQuery = gql(`
  query UseHighlightSearch($highlightId: ID!) {
    highlight(id: $highlightId) {
      id
      arc {
        id
        highlights {
          id
          entry {
            entryKey
          }
        }
      }
      entry {
        entryKey
      }
    }
  }
`);

export const useHighlightSearch = (
  args: UseHighlightSearchArgs
): UseHighlightSearchResults => {
  const {
    data: {
      highlight: {
        arc: { highlights: searchResults },
      },
    },
  } = useQuery(UseHighlightSearchQuery, {
    variables: { highlightId: args.highlightId },
  });

  const sortedResults = Object.values(searchResults).sort((a, b) =>
    compareDatesDesc(
      IpsumDateTime.fromString(a.entry.entryKey, "entry-printed-date"),
      IpsumDateTime.fromString(b.entry.entryKey, "entry-printed-date")
    )
  );

  return {
    searchResults: sortedResults,
  };
};
