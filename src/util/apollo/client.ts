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

const typeDefs = gql`
  type Query {
    journalId: String!
    journalTitle: String!
    journalMetadata: JournalMetadata!
    entries(ids: [ID!]): [Entry]
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
  entries: makeVar<UnhydratedType["Entry"][]>([]),
  arcs: makeVar<UnhydratedType["Arc"][]>([]),
  highlights: makeVar<UnhydratedType["Highlight"][]>([]),
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
  vars.entries([]);
  vars.arcs([]);
  vars.highlights([]);
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
      entries(_, { variables }) {
        if (variables.ids) {
          return vars
            .entries()
            .filter((entry) => variables.ids.includes(entry.entryKey));
        }
        return vars.entries();
      },
      arcs(_, { variables }) {
        if (variables.ids) {
          return vars.arcs().filter((arc) => variables.ids.includes(arc.id));
        }
        return vars.arcs();
      },
      highlights(_, { variables }) {
        if (variables.ids || variables.entries || variables.arcs) {
          return vars
            .highlights()
            .filter(
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
        return vars.arcs().find((arc) => arc.id === arcId);
      },
      entry(entryKey) {
        return vars.entries().find((entry) => entry.entryKey === entryKey);
      },
    },
  },
};

const cache = new InMemoryCache({ typePolicies });

export const client = new ApolloClient({ cache, typeDefs });
