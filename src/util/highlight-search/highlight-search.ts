import {
  Document,
  useStateDocumentQuery,
  useFindDocuments,
} from "state/in-memory";

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

  return {
    searchResults: Object.keys(searchResults).map(
      (result) => searchResults[result]
    ),
  };
};
