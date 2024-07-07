import { QueryRelationsArgs, StrictTypedTypePolicies } from "util/apollo";
import { PROJECT_STATE } from "util/state";

export const RelationResolvers: StrictTypedTypePolicies = {
  Query: {
    fields: {
      relation(_, { args }) {
        if (args?.id) {
          return PROJECT_STATE.collection("relations").get(args.id) ?? null;
        }
        return undefined;
      },
      relations(_, { args }: { args?: QueryRelationsArgs }) {
        if (args?.ids) {
          return args.ids.map((id) =>
            PROJECT_STATE.collection("relations").get(id)
          );
        }
        return Object.values(PROJECT_STATE.collection("relations").getAll());
      },
    },
  },
  Relation: {
    keyFields: ["id"],
    fields: {
      subject(subjectId: string, { readField }) {
        const id: string = readField("id");
        const type = PROJECT_STATE.collection("relations").get(id).subjectType;
        if (type === "Arc") {
          return PROJECT_STATE.collection("arcs").get(subjectId);
        } else if (type === "Highlight") {
          return PROJECT_STATE.collection("highlights").get(subjectId);
        }
      },
      object(objectId: string, { readField }) {
        const id: string = readField("id");
        const type = PROJECT_STATE.collection("relations").get(id).objectType;

        if (type === "Arc") {
          return PROJECT_STATE.collection("arcs").get(objectId);
        }
      },
    },
  },
};
