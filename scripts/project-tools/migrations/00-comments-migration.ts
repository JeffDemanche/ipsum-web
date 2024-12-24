import { InMemoryRelation } from "util/state";
import { v4 as uuid } from "uuid";

// 1. Create incomingRelations on highlights
// 2. Make sure commentEntries still compatible
// 3. On comment, rename "highlight" to "objectHighlight"
// 4. On comment, add "outgoingRelations"

export default function commentsMigration(data: any) {
  const commentsCopy = { ...data.comments };

  const relationsCopy = { ...data.relations };

  // Create incomingRelations on highlights
  Object.keys(data.highlights).forEach((highlight: any) => {
    console.log(highlight);
    data.highlights[highlight].incomingRelations = [];
  });

  Object.keys(commentsCopy).forEach((comment: any) => {
    const commentData = commentsCopy[comment];

    // Rename "highlight" to "objectHighlight"
    commentData.objectHighlight = commentData.highlight;
    delete commentData.highlight;

    console.log(commentData);

    const newRelationId = uuid();
    const newRelation: InMemoryRelation = {
      __typename: "Relation",
      id: newRelationId,
      objectType: "Highlight",
      object: commentData.objectHighlight,
      predicate: "responds to",
      subject: commentData.id,
      subjectType: "Comment",
    };

    relationsCopy[newRelationId] = newRelation;

    // Add "outgoingRelations"
    commentData.outgoingRelations = [newRelationId];

    data.highlights[commentData.objectHighlight].incomingRelations = [
      ...data.highlights[commentData.objectHighlight].incomingRelations,
      newRelationId,
    ];

    data.comments[comment] = commentData;
  });

  data.relations = relationsCopy;
  data.comments = commentsCopy;
}
