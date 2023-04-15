import {
  ApolloClient,
  InMemoryCache,
  TypePolicies,
  gql,
  makeVar,
} from "@apollo/client";
import { v4 as uuidv4 } from "uuid";

const typeDefs = gql`
  type Query {
    journalId: String!
    journalTitle: String!
    journalMetadata: JournalMetadata!
    entries: [Entry]
    arcs: [Arc]
    highlights: [Highlight]
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
    arcId: Arc!
    entryKey: Entry!
  }
`;

const journalId = makeVar(uuidv4());
const journalTitle = makeVar("new journal");
const journalMetadata = makeVar({ lastArcHue: 0 });
const entries = makeVar([
  { entryKey: "1/2/2020", date: "1/2/2020", contentState: "Hello, world!" },
]);
const arcs = makeVar([]);
const highlights = makeVar([]);

export const addEntry = () => {};

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
        return entries();
      },
      arcs(_, { variables }) {
        return arcs();
      },
      highlights(_, { variables }) {
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
  },
};

const cache = new InMemoryCache({ typePolicies });

export const client = new ApolloClient({ cache, typeDefs });
