import { QueryEntriesArgs, StrictTypedTypePolicies } from "util/apollo";
import { parseIpsumDateTime } from "util/dates";
import { IpsumTimeMachine } from "util/diff";
import { InMemoryHistory, PROJECT_STATE } from "util/state";

export const EntryResolvers: StrictTypedTypePolicies = {
  Query: {
    fields: {
      entry(_, { args }) {
        if (args.entryKey) {
          return PROJECT_STATE.collection("entries").get(args.entryKey) ?? null;
        }
        return null;
      },
      entries(_, { args }: { args: QueryEntriesArgs }) {
        if (args?.entryKeys) {
          return args.entryKeys
            .map((entryKey) =>
              PROJECT_STATE.collection("entries").get(entryKey)
            )
            .filter(Boolean);
        }
        return Object.values(PROJECT_STATE.collection("entries").getAll());
      },
      recentEntries(_, { args }) {
        return Object.values(PROJECT_STATE.collection("entries").getAll())
          .sort(
            (a, b) =>
              parseIpsumDateTime(b.history.dateCreated)
                .dateTime.toJSDate()
                .getTime() -
              parseIpsumDateTime(a.history.dateCreated)
                .dateTime.toJSDate()
                .getTime()
          )
          .slice(0, args.count);
      },
      entryKeys() {
        return Object.values(PROJECT_STATE.collection("entries").getAll()).map(
          (entry) => entry.entryKey
        );
      },
    },
  },
  Entry: {
    keyFields: ["entryKey"],
    fields: {
      highlights(_, { readField }) {
        return Object.values(
          PROJECT_STATE.collection("highlights").getAll()
        ).filter((highlight) => highlight.entry === readField("entryKey"));
      },
      date(_, { readField }) {
        return readField<InMemoryHistory>("history").dateCreated;
      },
      htmlString(_, { readField }) {
        const trackedHTMLString = readField<string>("trackedHTMLString");
        const timeMachine = IpsumTimeMachine.fromString(trackedHTMLString);
        return timeMachine.currentValue;
      },
      history(h) {
        return h;
      },
    },
  },
};
