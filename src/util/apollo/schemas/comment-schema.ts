import { gql } from "@apollo/client";

export const commentTypeDef = gql`
  type Query {
    comment(id: ID!): Comment
    comments(ids: [ID!]): [Comment]
  }

  type Comment {
    id: ID!
    parent: Comment
    commentEntry: CommentEntry!
    highlight: Highlight!
    history: History!
  }
`;
