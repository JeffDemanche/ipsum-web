import { useMemo } from "react";
import {
  Document,
  useStateDocumentQuery,
  useFindDocuments,
} from "state/in-memory";
import { compareDatesDesc, IpsumDateTime } from "util/dates";

interface UseHighlightSearchArgs {
  highlightId: string;
}

interface UseHighlightSearchResults {
  searchResults: Document<"highlight">[];
}

export const useHighlightSearch = (
  args: UseHighlightSearchArgs
): UseHighlightSearchResults => {
  const { data } = useStateDocumentQuery<"highlight">({
    collection: "highlight",
    keys: [args.highlightId],
  });

  const { documents: highlightsWithArc } = useFindDocuments({
    collection: "highlight",
    fieldName: "arcId",
    fieldValue: data[args.highlightId]?.arcId,
    skip: !data[args.highlightId],
  });

  const { data: searchResults } = useStateDocumentQuery<"highlight">({
    collection: "highlight",
    keys: highlightsWithArc ?? [],
  });

  const sortedResults = Object.values(searchResults).sort((a, b) =>
    compareDatesDesc(
      IpsumDateTime.fromString(a.entryKey, "entry-printed-date"),
      IpsumDateTime.fromString(b.entryKey, "entry-printed-date")
    )
  );

  return {
    searchResults: sortedResults,
  };
};
