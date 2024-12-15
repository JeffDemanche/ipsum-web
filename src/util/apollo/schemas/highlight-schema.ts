import { gql } from "@apollo/client";

export const highlightTypeDef = gql`
  type Query {
    highlight(id: ID!): Highlight
    highlights(
      ids: [ID!]
      entries: [ID!]
      arcs: [ID!]
      sort: HighlightSortType
    ): [Highlight]
  }

  union HighlightObject = Arc | Day

  type Highlight {
    id: ID!
    history: History!
    entry: Entry!
    arc: Arc
    arcs: [Arc!]!
    outgoingRelations: [Relation!]!
    hue: Int!
    excerpt: String!
    comments: [Comment!]!
    number: Int!
    objectText: String!
    object: HighlightObject!
    importanceRatings: [ImportanceRating!]!
    currentImportance: Float!
    srsCard: SRSCard
  }

  type ImportanceRating {
    day: Day!
    value: Float! # 0-1
  }

  enum HighlightSortType {
    DATE_DESC
    IMPORTANCE_DESC
  }
`;
