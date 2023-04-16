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

export const journalId = makeVar(uuidv4());
export const journalTitle = makeVar("new journal");
export const journalMetadata = makeVar({ lastArcHue: 0 });
export const entries = makeVar<UnhydratedType["Entry"][]>([]);
export const arcs = makeVar<UnhydratedType["Arc"][]>([]);
export const highlights = makeVar<UnhydratedType["Highlight"][]>([]);

export const initializeState = () => {
  journalId(uuidv4());
  journalTitle("new journal");
  journalMetadata({ lastArcHue: 0 });
  entries([]);
  arcs([]);
  highlights([]);
};

const typePolicies: TypePolicies = {
  Query: {
    fields: {
      journalId() {
        return journalId();
      },
      journalTitle() {
        return journalTitle();
      },
      journalMetadata() {
        return journalMetadata();
      },
      entries(_, { variables }) {
        if (variables.ids) {
          return entries().filter((entry) =>
            variables.ids.includes(entry.entryKey)
          );
        }
        return entries();
      },
      arcs(_, { variables }) {
        if (variables.ids) {
          return arcs().filter((arc) => variables.ids.includes(arc.id));
        }
        return arcs();
      },
      highlights(_, { variables }) {
        if (variables.ids || variables.entries || variables.arcs) {
          return highlights().filter(
            (highlight) =>
              (!variables.ids || variables.ids.includes(highlight.id)) &&
              (!variables.entries ||
                variables.entries.includes(highlight.entry)) &&
              (!variables.arcs || variables.arcs.includes(highlight.arc))
          );
        }
        return highlights();
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
        return arcs().find((arc) => arc.id === arcId);
      },
      entry(entryKey) {
        return entries().find((entry) => entry.entryKey === entryKey);
      },
    },
  },
};

const cache = new InMemoryCache({ typePolicies });

export const client = new ApolloClient({ cache, typeDefs });
