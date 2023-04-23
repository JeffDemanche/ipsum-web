import { UnhydratedType, vars } from "../client";

export const createHighlight = (
  highlight: Omit<UnhydratedType["Highlight"], "__typename">
) => {
  if (vars.highlights()[highlight.id]) return;

  vars.highlights({
    ...vars.highlights(),
    [highlight.id]: { __typename: "Highlight", ...highlight },
  });
};

export const updateHighlight = (
  highlight: Partial<UnhydratedType["Highlight"]>
) => {
  if (!highlight.id)
    throw new Error("updateHighlight: highlight.id is required");

  if (!vars.highlights()[highlight.id]) return;

  const newHighlights = { ...vars.highlights() };
  newHighlights[highlight.id] = {
    ...newHighlights[highlight.id],
    ...highlight,
  };
  vars.highlights(newHighlights);
};

export const deleteHighlight = (id: string) => {
  if (!vars.highlights()[id]) return;

  const newHighlights = { ...vars.highlights() };
  delete newHighlights[id];
  vars.highlights(newHighlights);
};
