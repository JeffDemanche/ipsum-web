import { UnhydratedType, vars } from "../client";

export const createHighlight = (
  highlight: Omit<UnhydratedType["Highlight"], "__typename">
) => {
  if (vars.highlights().find((h) => h.id === highlight.id)) return;

  vars.highlights([
    ...vars.highlights(),
    { ...highlight, __typename: "Highlight" },
  ]);
};

export const updateHighlight = (
  highlight: Partial<UnhydratedType["Highlight"]>
) => {
  const highlightIndex = vars
    .highlights()
    .findIndex((h) => h.id === highlight.id);
  if (highlightIndex === -1) return;

  const newHighlights = [...vars.highlights()];
  newHighlights[highlightIndex] = {
    ...newHighlights[highlightIndex],
    ...highlight,
  };
  vars.highlights(newHighlights);
};

export const deleteHighlight = (id: string) => {
  const highlightIndex = vars.highlights().findIndex((h) => h.id === id);
  if (highlightIndex === -1) return;

  const newHighlights = [...vars.highlights()];
  newHighlights.splice(highlightIndex, 1);
  vars.highlights(newHighlights);
};
