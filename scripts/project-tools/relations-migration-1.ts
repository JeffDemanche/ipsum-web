import { v4 as uuidv4 } from "uuid";

export const migrateRelations = (fileData: any) => {
  const highlights = fileData["highlights"];

  const highlightIdsToRelationIds: { [highlightId: string]: any } = {};
  const arcIdsToRelationIds: { [arcId: string]: any } = {};

  const relationsFromHighlights = Object.values(highlights).reduce(
    (prev: object, curr: { id: string; arc: string }) => {
      const id = uuidv4();
      return {
        ...prev,
        [id]: {
          id,
          subject: curr.id,
          subjectType: "Highlight",
          relation: "relates to",
          object: curr.arc,
          objectType: "Arc",
          __typename: "Relation",
        },
      };
    },
    {}
  );

  Object.values(relationsFromHighlights).forEach((relation: any) => {
    highlightIdsToRelationIds[relation.subject] = relation.id;
  });
  Object.values(relationsFromHighlights).forEach((relation: any) => {
    arcIdsToRelationIds[relation.object] = relation.id;
  });

  if (!fileData["relations"]) {
    fileData["relations"] = relationsFromHighlights;
  }

  Object.values(fileData["highlights"]).forEach((highlight: any) => {
    fileData["highlights"][highlight.id].outgoingRelations = [
      highlightIdsToRelationIds[highlight.id],
    ];
    delete fileData["highlights"][highlight.id].arc;
  });

  Object.values(fileData["arcs"]).forEach((arc: any) => {
    fileData["arcs"][arc.id].incomingRelations = [arcIdsToRelationIds[arc.id]];
    fileData["arcs"][arc.id].outgoingRelations = [];
  });
};
