import { UnhydratedType, vars } from "../client";
import { StrictTypedTypePolicies } from "../__generated__/apollo-helpers";
import { QueryArcsArgs, ArcSortType } from "../__generated__/graphql";

export const ArcResolvers: StrictTypedTypePolicies = {
  Query: {
    fields: {
      arc(_, { args }) {
        if (args?.id) {
          return vars.arcs()[args.id];
        }
        return null;
      },
      arcs(_, { args }: { args: QueryArcsArgs }) {
        let results: UnhydratedType["Arc"][] = [];
        if (args?.ids) {
          results = args.ids.map((id) => vars.arcs()[id]);
        } else {
          results = Object.values(vars.arcs());
        }

        if (args.sort === ArcSortType.AlphaDesc) {
          results.sort((a, b) => a.name.localeCompare(b.name));
        } else if (args.sort === ArcSortType.AlphaAsc) {
          results.sort((a, b) => b.name.localeCompare(a.name));
        }

        return results;
      },
    },
  },
  Arc: {
    keyFields: ["id"],
    fields: {
      highlights(_, { readField }) {
        return Object.values(vars.highlights()).filter((highlight) => {
          return highlight.outgoingRelations.some(
            (relation) => vars.relations()[relation].object === readField("id")
          );
        });
      },
      incomingRelations(relationIds: string[]) {
        return relationIds.map((id) => vars.relations()[id]);
      },
      outgoingRelations(relationIds: string[]) {
        return relationIds.map((id) => vars.relations()[id]);
      },
      arcEntry(arcEntryKey) {
        return vars.arcEntries()[arcEntryKey];
      },
    },
  },
};
