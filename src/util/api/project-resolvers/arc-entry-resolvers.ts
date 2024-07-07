import { QueryArcEntriesArgs, StrictTypedTypePolicies } from "util/apollo";
import { PROJECT_STATE } from "util/state";

export const ArcEntryResolvers: StrictTypedTypePolicies = {
  Query: {
    fields: {
      arcEntry(_, { args }) {
        if (args?.arcId) {
          const arcEntryKey = Object.values(
            PROJECT_STATE.collection("arcs").getAll()
          ).find((arc) => arc.id === args.arcId).arcEntry;
          return (
            PROJECT_STATE.collection("arcEntries").get(arcEntryKey) ?? null
          );
        }
        return null;
      },
      arcEntries(_, { args }: { args: QueryArcEntriesArgs }) {
        if (args?.entryKeys) {
          return args.entryKeys.map((entryKey) =>
            PROJECT_STATE.collection("arcEntries").get(entryKey)
          );
        }
        return Object.values(PROJECT_STATE.collection("arcEntries").getAll());
      },
    },
  },
  ArcEntry: {
    keyFields: ["entry"],
    fields: {
      arc(arcId) {
        return PROJECT_STATE.collection("arcs").get(arcId);
      },
      entry(entryKey) {
        const entry = PROJECT_STATE.collection("entries").get(entryKey);
        if (!entry) {
          throw new Error(`No entry found with key: ${entryKey}`);
        }
        return entry;
      },
    },
  },
};
