import { UnhydratedType, vars } from "../client";
import { v4 as uuidv4 } from "uuid";
import { autosave } from "../autosave";

export const createHighlight = ({
  entry,
  outgoingRelations,
}: {
  entry: string;
  outgoingRelations?: string[];
}): UnhydratedType["Highlight"] => {
  const highlightId = uuidv4();

  const result: UnhydratedType["Highlight"] = {
    __typename: "Highlight",
    id: highlightId,
    entry,
    outgoingRelations: outgoingRelations ?? [],
    history: { __typename: "History" },
  };
  vars.highlights({
    ...vars.highlights(),
    [highlightId]: { __typename: "Highlight", id: highlightId, ...result },
  });
  autosave();
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
  autosave();
};

export const deleteHighlight = (id: string) => {
  if (!vars.highlights()[id]) return;

  const highlight = vars.highlights()[id];

  const newRelations = { ...vars.relations() };
  highlight.outgoingRelations.forEach((relation) => {
    delete newRelations[relation];
  });
  vars.relations(newRelations);

  const newHighlights = { ...vars.highlights() };
  delete newHighlights[id];
  vars.highlights(newHighlights);
  autosave();
};
