import { APIFunction } from "../types";

export const deleteHighlight: APIFunction<{ id: string }, boolean> = (
  args,
  context
) => {
  const { projectState } = context;

  const highlight = projectState.collection("highlights").get(args.id);

  if (!highlight) {
    return;
  }

  Object.values(projectState.collection("relations").getAll()).forEach(
    (relation) => {
      if (relation.objectType === "Arc" && relation.subject === args.id) {
        projectState.collection("arcs").mutate(relation.object, (arc) => ({
          ...arc,
          incomingRelations: arc.incomingRelations.filter(
            (id) => id !== relation.id
          ),
        }));
      }

      if (relation.subject === args.id || relation.object === args.id) {
        projectState.collection("relations").delete(relation.id);
      }
    }
  );

  return projectState.collection("highlights").delete(args.id);

  // TODO Remove highlight formatting from entries.
};
