import {
  ApolloClient,
  InMemoryCache,
  TypePolicies,
  gql,
  makeVar,
} from "@apollo/client";

const typeDefs = gql`
  type Query {
    entries: [Entry]
    arcs: [Arc]
    highlights: [Highlight]
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

const entries = makeVar([
  { entryKey: "1/2/2020", date: "1/2/2020", contentState: "Hello, world!" },
]);
const arcs = makeVar([]);
const highlights = makeVar([]);

const typePolicies: TypePolicies = {
  Query: {
    fields: {
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
};

const cache = new InMemoryCache({ typePolicies });

export const client = new ApolloClient({ cache, typeDefs });
