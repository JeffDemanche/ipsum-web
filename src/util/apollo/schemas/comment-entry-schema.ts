import { gql } from "@apollo/client";

export const commentEntryTypeDef = gql`
  type Query {
    commentEntry(commentId: ID!): CommentEntry
    commentEntries(entryKeys: [ID!]): [CommentEntry]
  }

  type CommentEntry {
    entry: Entry!
    comment: Comment!
  }
`;
