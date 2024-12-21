import { gql } from "@apollo/client";

export const dayTypeDef = gql`
  type Query {
    day(day: String!): Day
    days(days: [String!]): [Day]

    daysWithJournalEntryOrComments: [Day!]!
  }

  type Day {
    day: String!
    journalEntry: JournalEntry
    changedArcEntries: [ArcEntry!]
    ratedHighlights: [Highlight!]
    comments: [Comment!]
    hasJournalEntry: Boolean!
    srsCardsReviewed: [SRSCard!]!
  }
`;
