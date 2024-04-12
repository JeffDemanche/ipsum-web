import { StrictTypedTypePolicies } from "../__generated__/apollo-helpers";
import { ArcSortType,QueryArcsArgs } from "../__generated__/graphql";
import { UnhydratedType, vars } from "../client";

export const ArcResolvers: StrictTypedTypePolicies = {
  Query: {
    fields: {
      arc(_, { args }) {
        if (args?.id) {
          const arc = vars.arcs()[args.id];
          return arc ?? null;
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
        const arcEntry = vars.arcEntries()[arcEntryKey];
        return arcEntry ?? null;
      },
    },
  },
};
