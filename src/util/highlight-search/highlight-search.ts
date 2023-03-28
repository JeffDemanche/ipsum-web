import { Document, useStateDocumentQuery } from "state/in-memory";

interface UseHighlightSearchArgs {
  highlightId: string;
}

interface UseHighlightSearchResults {
  orderedHighlights: Document<"highlight">[];
}

export const useHighlightSearch = (args: UseHighlightSearchArgs) => {
  const { data } = useStateDocumentQuery<"highlight">({
    collection: "highlight",
  });

  return {};
};
