import { gql } from "@apollo/client";

export const commentTypeDef = gql`
  type Query {
    comment(id: ID!): Comment
    comments(ids: [ID!]): [Comment]

    # ISO day string
    commentsForDay(day: String!): [Comment]
  }

  type Comment {
    id: ID!
    parent: Comment
    commentEntry: CommentEntry!
    htmlString: String!
    objectHighlight: Highlight!
    history: History!
  }
`;
