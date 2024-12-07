import { gql } from "@apollo/client";

export const relationTypeDef = gql`
  type Query {
    relation(id: ID!): Relation
    relations(ids: [ID!]): [Relation]
  }

  union RelationSubject = Arc | Highlight

  union RelationObject = Arc | Highlight

  type Relation {
    id: ID!
    subject: RelationSubject!
    predicate: String!
    object: RelationObject!
  }
`;
