import { deleteComment } from "../comment/delete-comment";
import { deleteRelationFromHighlightToArc } from "../relation/delete-relation-from-highlight-to-arc";
import type { APIFunction } from "../types";

export const deleteHighlight: APIFunction<{ id: string }, boolean> = (
  args,
  context
) => {
  const { projectState } = context;

  const highlight = projectState.collection("highlights").get(args.id);

  if (!highlight) {
    return;
  }

  highlight.comments.forEach((id) =>
    deleteComment({ id }, { projectState: projectState })
  );

  highlight.outgoingRelations.forEach((id) => {
    const relation = projectState.collection("relations").get(id);

    if (relation.objectType === "Arc" && relation.object === args.id) {
      deleteRelationFromHighlightToArc(
        { id: relation.id },
        { projectState: projectState }
      );
    }
  });

  Object.values(projectState.collection("relations").getAll()).forEach(
    (relation) => {
      if (relation.objectType === "Arc" && relation.subject === args.id) {
        projectState.collection("arcs").mutate(relation.object, (arc) => ({
          ...arc,
          incomingRelations: arc.incomingRelations.filter(
            (id) => id !== relation.id
          ),
        }));
      }

      if (relation.subject === args.id || relation.object === args.id) {
        projectState.collection("relations").delete(relation.id);
      }
    }
  );

  return projectState.collection("highlights").delete(args.id);

  // TODO Remove highlight formatting from entries.
};
