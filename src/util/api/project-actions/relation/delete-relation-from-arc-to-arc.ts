import type { APIFunction } from "../types";

export const deleteRelationFromArcToArc: APIFunction<
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

  if (relation.subjectType !== "Arc" || relation.objectType !== "Arc") {
    throw new Error(`Relation ${args.id} does not connect an arc to an arc`);
  }

  const subjectArc = projectState.collection("arcs").get(relation.subject);
  const objectArc = projectState.collection("arcs").get(relation.object);

  projectState
    .collection("arcs")
    .mutate(subjectArc.id, ({ outgoingRelations }) => ({
      outgoingRelations: outgoingRelations.filter((id) => id !== relation.id),
    }));
  projectState
    .collection("arcs")
    .mutate(objectArc.id, ({ incomingRelations }) => ({
      incomingRelations: incomingRelations.filter((id) => id !== relation.id),
    }));
  projectState.collection("relations").delete(args.id);

  return true;
};
