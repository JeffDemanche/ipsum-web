import { InMemoryRelation } from "util/state";
import { v4 as uuidv4 } from "uuid";

import { APIFunction } from "../types";

export const createRelationFromArcToArc: APIFunction<
  { id?: string; predicate: string; subjectArcId: string; objectArcId: string },
  InMemoryRelation
> = (args, context) => {
  const { projectState } = context;

  const id = args.id ?? uuidv4();

  if (!projectState.collection("arcs").has(args.subjectArcId)) {
    throw new Error(
      `No arc with id ${args.subjectArcId} exists in the project state`
    );
  }

  if (!projectState.collection("arcs").has(args.objectArcId)) {
    throw new Error(
      `No arc with id ${args.objectArcId} exists in the project state`
    );
  }

  const relation = projectState.collection("relations").create(id, {
    __typename: "Relation",
    id,
    predicate: args.predicate,
    subjectType: "Arc",
    subject: args.subjectArcId,
    objectType: "Arc",
    object: args.objectArcId,
  });

  projectState
    .collection("arcs")
    .mutate(args.subjectArcId, ({ outgoingRelations }) => ({
      outgoingRelations: [...outgoingRelations, relation.id],
    }));

  projectState
    .collection("arcs")
    .mutate(args.objectArcId, ({ incomingRelations }) => ({
      incomingRelations: [...incomingRelations, relation.id],
    }));

  return relation;
};
