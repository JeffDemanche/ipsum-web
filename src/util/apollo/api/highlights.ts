import { UnhydratedType, vars } from "../client";
import { v4 as uuidv4 } from "uuid";
import { autosave } from "../autosave";

export const createHighlight = ({
  arc,
  entry,
  outgoingRelations,
}: {
  arc: string;
  entry: string;
  outgoingRelations?: string[];
}): UnhydratedType["Highlight"] => {
  const highlightId = uuidv4();

  const result: UnhydratedType["Highlight"] = {
    __typename: "Highlight",
    id: highlightId,
    arc,
    entry,
    outgoingRelations: outgoingRelations ?? [],
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

  const newHighlights = { ...vars.highlights() };
  delete newHighlights[id];
  vars.highlights(newHighlights);
  autosave();
};
