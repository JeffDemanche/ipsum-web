import { gql } from "@apollo/client";

export const srsTypeDef = gql`
  type Query {
    srsCard(id: ID!): SRSCard
    srsCards(ids: [ID!]): [SRSCard]
  }

  type SRSCardReview {
    day: Day!
    rating: Int!
  }

  type SRSCard {
    id: ID!
    history: History!
    subject: Highlight!
    reviews: [SRSCardReview!]!
  }
`;
