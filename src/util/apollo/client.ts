import {
  ApolloClient,
  InMemoryCache,
  // eslint-disable-next-line import/named
  TypePolicies,
  gql,
  makeVar,
} from "@apollo/client";
import { v4 as uuidv4 } from "uuid";
import { Arc, Entry } from ".";
import {
  QueryArcsArgs,
  QueryEntriesArgs,
  QueryEntryArgs,
  QueryHighlightArgs,
  QueryHighlightsArgs,
} from "./__generated__/graphql";

const typeDefs = gql`
  type Query {
    journalId: String!
    journalTitle: String!
    journalMetadata: JournalMetadata!

    entry(entryKey: ID!): Entry
    entries(entryKeys: [ID!]): [Entry]

    arc(id: ID!): Arc
    arcs(ids: [ID!]): [Arc]

    highlight(id: ID!): Highlight
    highlights(ids: [ID!], entries: [ID!], arcs: [ID!]): [Highlight]
  }

  type JournalMetadata {
    lastArcHue: Int!
  }

  type Entry {
    entryKey: String!
    date: String!
    contentState: String!
    highlights: [Highlight!]!
  }

  type Arc {
    id: ID!
    name: String!
    color: Int!
    highlights: [Highlight!]!
  }

  type Highlight {
    id: ID!
    arc: Arc!
    entry: Entry!
  }
`;

export type UnhydratedType = {
  JournalMetadata: {
    __typename: "JournalMetadata";
    lastArcHue: number;
  };
  Entry: {
    __typename: "Entry";
    entryKey: string;
    date: string;
    contentState: string;
  };
  Arc: {
    __typename: "Arc";
    id: string;
    name: string;
    color: number;
  };
  Highlight: {
    __typename: "Highlight";
    id: string;
    arc: string;
    entry: string;
  };
};

export const vars = {
  journalId: makeVar(uuidv4()),
  journalTitle: makeVar("new journal"),
  journalMetadata: makeVar({ lastArcHue: 0 }),
  entries: makeVar<{ [entryKey in string]: UnhydratedType["Entry"] }>({}),
  arcs: makeVar<{ [id in string]: UnhydratedType["Arc"] }>({}),
  highlights: makeVar<{ [id in string]: UnhydratedType["Highlight"] }>({}),
};

export const serializeVars: (keyof typeof vars)[] = [
  "journalId",
  "journalTitle",
  "journalMetadata",
  "entries",
  "arcs",
  "highlights",
];

export const initializeState = () => {
  vars.journalId(uuidv4());
  vars.journalTitle("new journal");
  vars.journalMetadata({ lastArcHue: 0 });
  vars.entries({});
  vars.arcs({});
  vars.highlights({});
};

const typePolicies: TypePolicies = {
  Query: {
    fields: {
      journalId() {
        return vars.journalId();
      },
      journalTitle() {
        return vars.journalTitle();
      },
      journalMetadata() {
        return vars.journalMetadata();
      },
      entry(_, { args }) {
        if (args.entryKey) {
          return vars.entries()[args.entryKey] ?? null;
        }
        return null;
      },
      entries(_, { args }: { args: QueryEntriesArgs }) {
        if (args?.entryKeys) {
          return args.entryKeys.map((entryKey) => vars.entries()[entryKey]);
        }
        return Object.values(vars.entries());
      },
      arc(_, { args }) {
        if (args?.id) {
          return vars.arcs()[args.id];
        }
        return null;
      },
      arcs(_, { args }: { args: QueryArcsArgs }) {
        if (args?.ids) {
          return args.ids.map((id) => vars.arcs()[id]);
        }
        return Object.values(vars.arcs());
      },
      highlight(_, { args }) {
        if (args?.id) {
          return vars.highlights()[args.id];
        }
        return undefined;
      },
      highlights(_, { args }: { args?: QueryHighlightsArgs }) {
        if (args?.ids && !args?.entries && !args?.arcs) {
          return args.ids.map((id) => vars.highlights()[id]);
        } else if (args?.ids || args?.entries || args?.arcs) {
          return Object.values(vars.highlights()).filter(
            (highlight) =>
              (!args.ids || args.ids.includes(highlight.id)) &&
              (!args.entries || args.entries.includes(highlight.entry)) &&
              (!args.arcs || args.arcs.includes(highlight.arc))
          );
        }
        return Object.values(vars.highlights());
      },
    },
  },
  Entry: {
    keyFields: ["entryKey"],
    fields: {
      highlights(_, { readField }) {
        return Object.values(vars.highlights()).filter(
          (highlight) => highlight.entry === readField("entryKey")
        );
      },
    },
  },
  Arc: {
    keyFields: ["id"],
    fields: {
      highlights(_, { readField }) {
        return Object.values(vars.highlights()).filter(
          (highlight) => highlight.arc === readField("id")
        );
      },
    },
  },
  Highlight: {
    keyFields: ["id"],
    fields: {
      arc(arcId) {
        return vars.arcs()[arcId];
      },
      entry(entryKey) {
        return vars.entries()[entryKey];
      },
    },
  },
};

const cache = new InMemoryCache({ typePolicies, addTypename: true });

export const client = new ApolloClient({ cache, typeDefs });
