import { ApolloClient, from, gql, InMemoryCache } from "@apollo/client";
import { onError } from "@apollo/client/link/error";
import {
  ArcEntryResolvers,
  ArcResolvers,
  CommentEntryResolvers,
  CommentResolvers,
  DayResolvers,
  EntryResolvers,
  HighlightResolvers,
  JournalEntryResolvers,
  RelationResolvers,
  SearchResolvers,
  SRSResolvers,
} from "util/api";
import { PROJECT_STATE } from "util/state";

import { StrictTypedTypePolicies } from "./__generated__/apollo-helpers";
import { arcEntryTypeDef } from "./schemas/arc-entry-schema";
import { arcTypeDef } from "./schemas/arc-schema";
import { commentEntryTypeDef } from "./schemas/comment-entry-schema";
import { commentTypeDef } from "./schemas/comment-schema";
import { dayTypeDef } from "./schemas/day-schema";
import { entryTypeDef } from "./schemas/entry-schema";
import { highlightTypeDef } from "./schemas/highlight-schema";
import { journalEntryTypeDef } from "./schemas/journal-entry-schema";
import { relationTypeDef } from "./schemas/relation-schema";
import { searchTypeDef } from "./schemas/search-schema";
import { srsTypeDef } from "./schemas/srs-schema";

const typeDefs = gql`
  type Query {
    journalId: String!
    journalTitle: String!
    journalMetadata: JournalMetadata!
  }

  # Generalized type that can be used on objects that have a history
  type History {
    dateCreated: String
  }

  type JournalMetadata {
    lastArcHue: Int!
  }
`;

const typePolicies: StrictTypedTypePolicies = {
  Query: {
    fields: {
      journalId() {
        return PROJECT_STATE.get("journalId");
      },
      journalTitle() {
        return PROJECT_STATE.get("journalTitle");
      },
      journalMetadata() {
        return PROJECT_STATE.get("journalMetadata");
      },
      ...EntryResolvers.Query.fields,
      ...ArcEntryResolvers.Query.fields,
      ...CommentEntryResolvers.Query.fields,
      ...RelationResolvers.Query.fields,
      ...HighlightResolvers.Query.fields,
      ...SearchResolvers.Query.fields,
      ...ArcResolvers.Query.fields,
      ...DayResolvers.Query.fields,
      ...JournalEntryResolvers.Query.fields,
      ...CommentResolvers.Query.fields,
      ...SRSResolvers.Query.fields,
    },
  },
  Entry: EntryResolvers.Entry,
  ArcEntry: ArcEntryResolvers.ArcEntry,
  CommentEntry: CommentEntryResolvers.CommentEntry,
  Relation: RelationResolvers.Relation,
  Arc: ArcResolvers.Arc,
  Highlight: HighlightResolvers.Highlight,
  ImportanceRating: HighlightResolvers.ImportanceRating,
  Day: DayResolvers.Day,
  JournalEntry: JournalEntryResolvers.JournalEntry,
  Comment: CommentResolvers.Comment,
  SRSCard: SRSResolvers.SRSCard,
  SRSCardReview: SRSResolvers.SRSCardReview,
};

const cache = new InMemoryCache({ typePolicies, addTypename: true });

const errorLink = onError((errors) => {
  console.log("errors", errors);

  errors.forward(errors.operation);
});

export const client = new ApolloClient({
  cache,
  typeDefs: [
    typeDefs,
    entryTypeDef,
    arcEntryTypeDef,
    commentEntryTypeDef,
    relationTypeDef,
    arcTypeDef,
    searchTypeDef,
    highlightTypeDef,
    dayTypeDef,
    journalEntryTypeDef,
    commentTypeDef,
    srsTypeDef,
  ],
  link: from([errorLink]),
});
