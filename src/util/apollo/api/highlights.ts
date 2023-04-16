import { UnhydratedType, highlights } from "../client";

export const createHighlight = (
  highlight: Omit<UnhydratedType["Highlight"], "__typename">
) => {
  if (highlights().find((h) => h.id === highlight.id)) return;

  highlights([...highlights(), { ...highlight, __typename: "Highlight" }]);
};

export const updateHighlight = (
  highlight: Partial<UnhydratedType["Highlight"]>
) => {
  const highlightIndex = highlights().findIndex((h) => h.id === highlight.id);
  if (highlightIndex === -1) return;

  const newHighlights = [...highlights()];
  newHighlights[highlightIndex] = {
    ...newHighlights[highlightIndex],
    ...highlight,
  };
  highlights(newHighlights);
};

export const deleteHighlight = (id: string) => {
  const highlightIndex = highlights().findIndex((h) => h.id === id);
  if (highlightIndex === -1) return;

  const newHighlights = [...highlights()];
  newHighlights.splice(highlightIndex, 1);
  highlights(newHighlights);
};
