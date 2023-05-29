import { UnhydratedType, vars } from "../client";
import { v4 as uuidv4 } from "uuid";
import { autosave } from "../autosave";
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
