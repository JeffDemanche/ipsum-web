import { gql } from "@apollo/client";

export const entryTypeDef = gql`
  type Query {
    entry(entryKey: ID!): Entry
    entries(entryKeys: [ID!]): [Entry]
    recentEntries(count: Int!): [Entry!]!
    entryKeys: [String!]!
  }

  enum EntryType {
    JOURNAL
    ARC
  }

  type Entry {
    entryKey: String!
    date: String!
    htmlString: String!
    trackedHTMLString: String!
    highlights: [Highlight!]!
    entryType: EntryType!
    history: History!
  }
`;
