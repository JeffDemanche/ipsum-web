import { gql } from "@apollo/client";

export const searchTypeDef = gql`
  type Query {
    searchHighlights(criteria: SearchCriteria!): [Highlight!]!
  }

  input SearchCriterionDays {
    days: [String!]!
  }

  input SearchCriterionRelatesToArc {
    arcId: String!
    predicate: String!
  }

  input SearchCriterion {
    days: SearchCriterionDays
    relatesToArc: SearchCriterionRelatesToArc
  }

  input SearchCriteriaAnd {
    or: [SearchCriterion!]!
  }

  input SearchCriteria {
    and: [SearchCriteriaAnd!]!
  }
`;
