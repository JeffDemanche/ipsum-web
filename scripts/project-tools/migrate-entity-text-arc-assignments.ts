import { convertFromRaw, convertToRaw } from "draft-js";
import util from "util";

export const migrateEntityTextArcAssignments = (
  data: any,
  arcAssignmentsPath: string,
  entriesPath: string
) => {
  const arcAssignments = data[arcAssignmentsPath];

  Object.values(data[entriesPath]).forEach((entry: any) => {
    const contentState = convertFromRaw(JSON.parse(entry.contentState));
    const entityEntries = contentState.getAllEntities().entries();
    let entityEntry: any = entityEntries.next();
    while (entityEntry.value) {
      const arcAssignmentsForEntity: any = Object.values(arcAssignments).filter(
        (a: any) => {
          return (
            entityEntry.value[1].toJS().data.arcIds.includes(a.arcId) &&
            a.entryKey === entry.entryKey
          );
        }
      );
      contentState.mergeEntityData(entityEntry.value[0], {
        textArcAssignments: arcAssignmentsForEntity.map((assgn: any) => ({
          arcId: assgn.arcId,
          arcAssignmentId: assgn.id,
        })),
      });
      entityEntry = entityEntries.next();
    }
    data[entriesPath][entry.entryKey].contentState = JSON.stringify(
      convertToRaw(contentState)
    );
  });
};
