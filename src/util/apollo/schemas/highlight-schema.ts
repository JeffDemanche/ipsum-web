import { gql } from "@apollo/client";

export const highlightTypeDef = gql`
  type Query {
    highlight(id: ID!): Highlight
    highlights(ids: [ID!], entries: [ID!], arcs: [ID!]): [Highlight]
  }

  type Highlight {
    id: ID!
    history: History!
    entry: Entry!
    arc: Arc
    arcs: [Arc!]!
    outgoingRelations: [Relation!]!
    srsCards: [SRSCard!]!
    hue: Int!
    excerpt: String!
  }
`;
