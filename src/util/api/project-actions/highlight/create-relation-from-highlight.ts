import { InMemoryRelation } from "util/state";
import { v4 as uuidv4 } from "uuid";

import { APIFunction } from "../types";

export const createRelationFromHighlight: APIFunction<
  {
    id?: string;
    predicate: string;
    highlightId: string;
    arcId: string;
  },
  InMemoryRelation
> = (args, context) => {
  const { projectState } = context;

  const id = args.id ?? uuidv4();

  if (!projectState.collection("highlights").has(args.highlightId)) {
    throw new Error(
      `No highlight with id ${args.highlightId} exists in the project state`
    );
  }

  if (!projectState.collection("arcs").has(args.arcId)) {
    throw new Error(`No arc with id ${args.arcId} exists in the project state`);
  }

  const relation = projectState.collection("relations").create(id, {
    __typename: "Relation",
    id,
    predicate: args.predicate,
    subjectType: "Highlight",
    subject: args.highlightId,
    objectType: "Arc",
    object: args.arcId,
  });

  projectState
    .collection("highlights")
    .mutate(args.highlightId, ({ outgoingRelations }) => ({
      outgoingRelations: [...outgoingRelations, relation.id],
    }));

  return relation;
};
