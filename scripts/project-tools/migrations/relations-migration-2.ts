export const fixArcIncomingRelations = (fileData: any) => {
  Object.values(fileData["relations"]).forEach((relation: any) => {
    const objectArc = fileData["arcs"][relation.object];
    if (objectArc && !objectArc.incomingRelations.includes(relation.id)) {
      fileData["arcs"][relation.object].incomingRelations.push(relation.id);
    }
  });
};
