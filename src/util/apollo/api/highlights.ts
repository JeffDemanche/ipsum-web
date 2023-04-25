import { UnhydratedType, vars } from "../client";
import { v4 as uuidv4 } from "uuid";

export const createHighlight = (
  highlight: Omit<UnhydratedType["Highlight"], "__typename" | "id">
): UnhydratedType["Highlight"] => {
  const highlightId = uuidv4();

  const result: UnhydratedType["Highlight"] = {
    __typename: "Highlight",
    id: highlightId,
    ...highlight,
  };
  vars.highlights({
    ...vars.highlights(),
    [highlightId]: { __typename: "Highlight", id: highlightId, ...result },
  });
  return result;
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
