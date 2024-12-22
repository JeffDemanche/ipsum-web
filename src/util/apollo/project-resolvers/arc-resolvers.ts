import type {
  QueryArcsArgs,
  StrictTypedTypePolicies} from "util/apollo";
import {
  ArcSortType
} from "util/apollo";
import type { InMemoryArc} from "util/state";
import { PROJECT_STATE } from "util/state";

export const ArcResolvers: StrictTypedTypePolicies = {
  Query: {
    fields: {
      arc(_, { args }) {
        if (args?.id) {
          const arc = PROJECT_STATE.collection("arcs").get(args.id);
          return arc ?? null;
        }
        return null;
      },
      arcByName(_, { args }) {
        if (args?.name) {
          const arc = Object.values(
            PROJECT_STATE.collection("arcs").getAllByField("name", args.name)
          )?.[0];
          return arc ?? null;
        }
        return null;
      },
      arcs(_, { args }: { args: QueryArcsArgs }) {
        let results: InMemoryArc[] = [];
        if (args?.ids) {
          results = args.ids.map((id) =>
            PROJECT_STATE.collection("arcs").get(id)
          );
        } else {
          results = Object.values(PROJECT_STATE.collection("arcs").getAll());
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
        return Object.values(
          PROJECT_STATE.collection("highlights").getAll()
        ).filter((highlight) => {
          return highlight.outgoingRelations.some(
            (relation) =>
              PROJECT_STATE.collection("relations").get(relation).object ===
              readField("id")
          );
        });
      },
      incomingRelations(relationIds: string[]) {
        return relationIds.map((id) =>
          PROJECT_STATE.collection("relations").get(id)
        );
      },
      outgoingRelations(relationIds: string[]) {
        return relationIds.map((id) =>
          PROJECT_STATE.collection("relations").get(id)
        );
      },
      arcEntry(arcEntryKey) {
        const arcEntry =
          PROJECT_STATE.collection("arcEntries").get(arcEntryKey);
        return arcEntry ?? null;
      },
    },
  },
};
