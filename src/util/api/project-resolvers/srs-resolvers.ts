import { StrictTypedTypePolicies } from "util/apollo";
import { PROJECT_STATE } from "util/state";

export const SRSResolvers: StrictTypedTypePolicies = {
  Query: {
    fields: {
      srsCard(_, { args }: { args: { id?: string } }) {
        if (args?.id) {
          return PROJECT_STATE.collection("srsCards").get(args.id) ?? null;
        }
        return null;
      },
      srsCards(_, { args }: { args: { ids?: string[] } }) {
        if (args?.ids) {
          return args.ids.map((id) =>
            PROJECT_STATE.collection("srsCards").get(id)
          );
        }
        return Object.values(PROJECT_STATE.collection("srsCards").getAll());
      },
    },
  },
};
