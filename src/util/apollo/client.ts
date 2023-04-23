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
  QueryHighlightsArgs,
} from "./__generated__/graphql";

const typeDefs = gql`
  type Query {
    journalId: String!
    journalTitle: String!
    journalMetadata: JournalMetadata!
    entries(entryKeys: [ID!]): [Entry]
    arcs(ids: [ID!]): [Arc]
    highlights(ids: [ID!], entries: [ID!], arcs: [ID!]): [Highlight]
  }

  type JournalMetadata {
    lastArcHue: Int!
  }

  type Entry {
    entryKey: String!
    date: String!
    contentState: String!
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
  Entry: Entry;
  Arc: Arc;
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
      entries(_, { variables }: { variables?: QueryEntriesArgs }) {
        if (variables?.entryKeys) {
          return variables.entryKeys.map(
            (entryKey) => vars.entries()[entryKey]
          );
        }
        return vars.entries();
      },
      arcs(_, { variables }: { variables?: QueryArcsArgs }) {
        if (variables?.ids) {
          return variables.ids.map((id) => vars.arcs()[id]);
        }
        return vars.arcs();
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
