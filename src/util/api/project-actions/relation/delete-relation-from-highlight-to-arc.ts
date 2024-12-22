import { client } from "util/apollo";

import type { APIFunction } from "../types";

export const deleteRelationFromHighlightToArc: APIFunction<
  { id: string },
  boolean
> = (args, context) => {
  const { projectState } = context;

  const relation = projectState.collection("relations").get(args.id);

  if (!relation) {
    throw new Error(
      `No relation with id ${args.id} exists in the project state`
    );
  }

  if (relation.subjectType !== "Highlight" || relation.objectType !== "Arc") {
    throw new Error(
      `Relation ${args.id} does not connect a highlight to an arc`
    );
  }

  const highlight = projectState.collection("highlights").get(relation.subject);

  if (!highlight) {
    throw new Error(
      `Relation ${args.id} has a subject that does not exist or is not a highlight`
    );
  }

  const arc = projectState.collection("arcs").get(relation.object);

  projectState
    .collection("highlights")
    .mutate(highlight.id, ({ outgoingRelations }) => ({
      outgoingRelations: outgoingRelations.filter((id) => id !== relation.id),
    }));
  projectState.collection("arcs").mutate(arc.id, ({ incomingRelations }) => ({
    incomingRelations: incomingRelations.filter((id) => id !== relation.id),
  }));
  projectState.collection("relations").delete(args.id);

  return true;
};
