import { gql } from "@apollo/client";

export const searchTypeDef = gql`
  type Query {
    searchHighlights(program: String!): [Highlight!]!
    searchArcs(program: String!): [Arc!]!

    searchArcsByName(search: String!): [Arc!]!
  }
`;
