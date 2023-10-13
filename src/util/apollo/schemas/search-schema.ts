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
    predicates: [String!]
  }

  input SearchCriterionRelatesToHighlight {
    highlightId: String!
  }

  input SearchCriterion {
    days: SearchCriterionDays
    relatesToArc: SearchCriterionRelatesToArc
    relatesToHighlight: SearchCriterionRelatesToHighlight
  }

  input SearchCriteriaAnd {
    or: [SearchCriterion!]!
  }

  input SearchCriteria {
    and: [SearchCriteriaAnd!]!
  }
`;
