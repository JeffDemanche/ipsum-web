import { gql } from "@apollo/client";

export const arcTypeDef = gql`
  type Query {
    arc(id: ID!): Arc
    arcs(ids: [ID!], sort: ArcSortType): [Arc]
  }

  type Arc {
    id: ID!
    name: String!
    color: Int!
    highlights: [Highlight!]!
    history: History!
    arcEntry: ArcEntry!

    incomingRelations: [Relation!]!
    outgoingRelations: [Relation!]!
  }

  enum ArcSortType {
    ALPHA_ASC
    ALPHA_DESC
  }
`;
