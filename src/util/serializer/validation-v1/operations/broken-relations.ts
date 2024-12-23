import type { InMemoryRelation } from "util/state";

import type { ValidatorStep } from "../serializer-validator";

export const validatorBrokenRelations: ValidatorStep<{
  missingSubjects: InMemoryRelation[];
  missingObjects: InMemoryRelation[];
}> = {
  description: "Ensure all relations' subjects and objects exist",
  fn: (value) => {
    const missingSubjects = Object.values(value.relations).filter(
      (relation) => {
        switch (relation.subjectType) {
          case "Highlight":
            return !value.highlights[relation.subject];
          case "Arc":
            return !value.arcs[relation.subject];
          case "Comment":
            return !value.comments[relation.subject];
          default:
            throw new Error(`Unknown subject type: ${relation.subjectType}`);
        }
      }
    );

    const missingObjects = Object.values(value.relations).filter((relation) => {
      switch (relation.objectType) {
        case "Highlight":
          return !value.highlights[relation.object];
        case "Arc":
          return !value.arcs[relation.object];
        default:
          throw new Error(`Unknown object type: ${relation.objectType}`);
      }
    });

    if (missingSubjects.length === 0 && missingObjects.length === 0) {
      return { result: "pass" };
    }

    return {
      result: "fail",
      message: `The following relations have missing subjects: ${[
        ...missingSubjects.map((relation) => relation.id),
      ].join(", ")} The following relations have missing objects: ${[
        ...missingObjects.map((relation) => relation.id),
      ].join(", ")}`,
      context: {
        missingSubjects,
        missingObjects,
      },
    };
  },
  fix: (value, { missingObjects, missingSubjects }) => {
    const fixedValue = { ...value };

    for (const relation of missingSubjects) {
      console.log(
        `[FIX] Removing relation with missing subject: ${relation.id} (${relation.subjectType} ${relation.predicate} ${relation.objectType})`
      );

      switch (relation.objectType) {
        case "Highlight":
          if (fixedValue.highlights[relation.object]) {
            fixedValue.highlights[relation.object].incomingRelations =
              fixedValue.highlights[relation.object].incomingRelations.filter(
                (id) => id !== relation.id
              );
          }
          break;
        case "Arc":
          if (fixedValue.arcs[relation.object]) {
            fixedValue.arcs[relation.object].incomingRelations =
              fixedValue.arcs[relation.object].incomingRelations.filter(
                (id) => id !== relation.id
              );
          }
          break;
        default:
          throw new Error(`Unknown object type: ${relation.objectType}`);
      }

      if (fixedValue.relations[relation.id]) {
        delete fixedValue.relations[relation.id];
      }
    }
    for (const relation of missingObjects) {
      console.log(
        `[FIX] Removing relation with missing subject: ${relation.id} (${relation.subjectType} ${relation.predicate} ${relation.objectType})`
      );

      switch (relation.subjectType) {
        case "Highlight":
          if (fixedValue.highlights[relation.subject]) {
            fixedValue.highlights[relation.subject].outgoingRelations =
              fixedValue.highlights[relation.subject].outgoingRelations.filter(
                (id) => id !== relation.id
              );
          }
          break;
        case "Arc":
          if (fixedValue.arcs[relation.subject]) {
            fixedValue.arcs[relation.subject].outgoingRelations =
              fixedValue.arcs[relation.subject].outgoingRelations.filter(
                (id) => id !== relation.id
              );
          }
          break;
        case "Comment":
          if (fixedValue.comments[relation.subject]) {
            fixedValue.comments[relation.subject].outgoingRelations =
              fixedValue.comments[relation.subject].outgoingRelations.filter(
                (id) => id !== relation.id
              );
          }
          break;
        default:
          throw new Error(`Unknown subject type: ${relation.subjectType}`);
      }

      if (fixedValue.relations[relation.id]) {
        delete fixedValue.relations[relation.id];
      }
    }

    return fixedValue;
  },
};
