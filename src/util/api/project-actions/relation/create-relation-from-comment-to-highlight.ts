import type { InMemoryRelation } from "util/state";
import { v4 as uuidv4 } from "uuid";

import type { APIFunction } from "../types";

export const createRelationFromCommentToHighlight: APIFunction<
  { id?: string; predicate: "responds to"; subject: string; object: string },
  InMemoryRelation
> = (args, context) => {
  const { projectState } = context;

  const id = args.id ?? uuidv4();

  if (!projectState.collection("comments").has(args.subject)) {
    throw new Error(
      `No comment with id ${args.subject} exists in the project state`
    );
  }

  if (!projectState.collection("highlights").has(args.object)) {
    throw new Error(
      `No highlight with id ${args.object} exists in the project state`
    );
  }

  const relation = projectState.collection("relations").create(id, {
    __typename: "Relation",
    id,
    predicate: args.predicate,
    subjectType: "Comment",
    subject: args.subject,
    objectType: "Highlight",
    object: args.object,
  });

  projectState
    .collection("comments")
    .mutate(args.subject, ({ outgoingRelations }) => ({
      outgoingRelations: [...outgoingRelations, relation.id],
    }));

  projectState
    .collection("highlights")
    .mutate(args.object, ({ incomingRelations }) => ({
      incomingRelations: [...incomingRelations, relation.id],
    }));

  return relation;
};
