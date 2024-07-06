import { gql } from "@apollo/client";

export const arcEntryTypeDef = gql`
  type Query {
    arcEntry(arcId: ID!): ArcEntry
    arcEntries(entryKeys: [ID!]): [ArcEntry]
  }

  type ArcEntry {
    entry: Entry!
    arc: Arc!
  }
`;
