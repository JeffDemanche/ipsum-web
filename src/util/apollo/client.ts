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

    highlight(id: ID!): Arc
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
  }

  type Highlight {
    id: ID!
    arc: Arc!
    entry: Entry!
  }
`;

export type UnhydratedType = {
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
  entries: makeVar<{ [entryKey: string]: UnhydratedType["Entry"] }>({}),
  arcs: makeVar<{ [id: string]: UnhydratedType["Arc"] }>({}),
  highlights: makeVar<{ [id: string]: UnhydratedType["Highlight"] }>({}),
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
      entry(_, { variables }) {
        if (variables.entryKey) {
          return vars.entries()[variables.entryKey] ?? null;
        }
        return null;
      },
      entries(_, { variables }: { variables?: QueryEntriesArgs }) {
        if (variables?.entryKeys) {
          return variables.entryKeys.map(
            (entryKey) => vars.entries()[entryKey]
          );
        }
        return vars.entries();
      },
      arc(_, { variables }) {
        if (variables?.id) {
          return vars.arcs()[variables.id];
        }
        return null;
      },
      arcs(_, { variables }: { variables?: QueryArcsArgs }) {
        if (variables?.ids) {
          return variables.ids.map((id) => vars.arcs()[id]);
        }
        return vars.arcs();
      },
      highlight(_, { variables }) {
        if (variables?.id) {
          return vars.highlights()[variables.id];
        }
        return null;
      },
      highlights(_, { variables }: { variables?: QueryHighlightsArgs }) {
        if (variables?.ids && !variables?.entries && !variables?.arcs) {
          return variables.ids.map((id) => vars.highlights()[id]);
        } else if (variables?.ids || variables?.entries || variables?.arcs) {
          return Object.values(vars.highlights()).filter(
            (highlight) =>
              (!variables.ids || variables.ids.includes(highlight.id)) &&
              (!variables.entries ||
                variables.entries.includes(highlight.entry)) &&
              (!variables.arcs || variables.arcs.includes(highlight.arc))
          );
        }
        return vars.highlights();
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

const cache = new InMemoryCache({ typePolicies });

export const client = new ApolloClient({ cache, typeDefs });
