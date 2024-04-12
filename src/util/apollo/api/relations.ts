import { v4 as uuidv4 } from "uuid";

import { autosave } from "../autosave";
import { UnhydratedType, vars } from "../client";
import { updateArc } from "./arcs";
import { updateHighlight } from "./highlights";

export const createRelation = ({
  subject,
  subjectType,
  predicate,
  object,
  objectType,
}: {
  subject: string;
  subjectType: "Arc" | "Highlight";
  predicate: string;
  object: string;
  objectType: "Arc";
}): UnhydratedType["Relation"] => {
  const relationId = uuidv4();

  const result: UnhydratedType["Relation"] = {
    __typename: "Relation",
    id: relationId,
    subject,
    subjectType,
    predicate,
    object,
    objectType: "Arc",
  };
  vars.relations({ ...vars.relations(), [relationId]: result });

  // Update outgoing relations on subject objects
  if (subjectType === "Arc") {
    if (!vars.arcs()[subject])
      throw new Error("createRelation: Subject arc not found");
    updateArc({
      id: subject,
      outgoingRelations: [
        ...vars.arcs()[subject].outgoingRelations,
        relationId,
      ],
    });
  } else if (subjectType === "Highlight") {
    if (!vars.highlights()[subject])
      throw new Error("createRelation: Subject highlight not found");
    updateHighlight({
      id: subject,
      outgoingRelations: [
        ...vars.highlights()[subject].outgoingRelations,
        relationId,
      ],
    });
  }

  if (objectType === "Arc") {
    if (!vars.arcs()[object])
      throw new Error("createRelation: Object arc not found");
    updateArc({
      id: object,
      incomingRelations: [...vars.arcs()[object].incomingRelations, relationId],
    });
  }

  autosave();
  return result;
};

export const deleteRelation = (id: string) => {
  const relation = vars.relations()[id];
  if (!relation) throw new Error("deleteRelation: Relation not found");

  delete vars.relations()[id];

  // Update outgoing relations on subject objects
  if (relation.subjectType === "Arc") {
    if (!vars.arcs()[relation.subject])
      throw new Error("deleteRelation: Subject arc not found");
    updateArc({
      id: relation.subject,
      outgoingRelations: vars.arcs()[
        // eslint-disable-next-line no-unexpected-multiline
        relation.subject
      ].outgoingRelations.filter((relationId) => relationId !== id),
    });
  } else if (relation.subjectType === "Highlight") {
    if (!vars.highlights()[relation.subject])
      throw new Error("deleteRelation: Subject highlight not found");
    updateHighlight({
      id: relation.subject,
      outgoingRelations: vars.highlights()[
        // eslint-disable-next-line no-unexpected-multiline
        relation.subject
      ].outgoingRelations.filter((relationId) => relationId !== id),
    });
  }

  if (relation.objectType === "Arc") {
    if (!vars.arcs()[relation.object])
      throw new Error("deleteRelation: Object arc not found");
    updateArc({
      id: relation.object,
      incomingRelations: vars.arcs()[
        // eslint-disable-next-line no-unexpected-multiline
        relation.object
      ].incomingRelations.filter((relationId) => relationId !== id),
    });
  }

  autosave();
};
