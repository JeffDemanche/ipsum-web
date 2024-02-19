import { gql } from "@apollo/client";

export const journalEntryTypeDef = gql`
  type Query {
    recentJournalEntries(count: Int, includeEmpty: Boolean): [JournalEntry!]!
    journalEntryDates(includeEmpty: Boolean): [String!]!

    journalEntry(entryKey: ID!): JournalEntry
    journalEntryKeys(includeEmpty: Boolean): [ID!]!
    journalEntries(entryKeys: [ID!], includeEmpty: Boolean): [JournalEntry]
  }

  type JournalEntry {
    entryKey: String!
    entry: Entry!
  }
`;
