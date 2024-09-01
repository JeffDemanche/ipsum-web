import {
  ApolloClient,
  from,
  gql,
  InMemoryCache,
  makeVar,
} from "@apollo/client";
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
} from "util/api";
import { PROJECT_STATE } from "util/state";
import { v4 as uuidv4 } from "uuid";

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

export type UnhydratedType = {
  History: {
    __typename: "History";
    dateCreated?: string;
  };
  JournalMetadata: {
    __typename: "JournalMetadata";
    lastArcHue: number;
  };
  Entry: {
    __typename: "Entry";
    entryKey: string;
    trackedHTMLString: string;
    history: UnhydratedType["History"];
    entryType: "JOURNAL" | "ARC" | "COMMENT";
  };
  JournalEntry: {
    __typename: "JournalEntry";
    entryKey: string;
    entry: string;
  };
  ArcEntry: {
    __typename: "ArcEntry";
    entry: string;
    arc: string;
  };
  CommentEntry: {
    __typename: "CommentEntry";
    entry: string;
    comment: string;
  };
  Arc: {
    __typename: "Arc";
    id: string;
    history: UnhydratedType["History"];
    arcEntry: string;
    name: string;
    color: number;
    incomingRelations: string[];
    outgoingRelations: string[];
  };
  ImportanceRating: {
    __typename: "ImportanceRating";
    day: string;
    value: number;
  };
  Highlight: {
    __typename: "Highlight";
    id: string;
    history: UnhydratedType["History"];
    entry: string;
    outgoingRelations: string[];
    importanceRatings: UnhydratedType["ImportanceRating"][];
    comments: string[];
  };
  Relation: {
    __typename: "Relation";
    id: string;
    subjectType: "Arc" | "Highlight";
    subject: string;
    predicate: string;
    objectType: "Arc";
    object: string;
  };
  Day: {
    __typename: "Day";
    day: string;
    journalEntry?: string;
    ratedHighlights: string[];
    changedArcEntries: string[];
    comments: string[];
  };
  Comment: {
    __typename: "Comment";
    id: string;
    parent: string | null;
    highlight: string;
    commentEntry: string;
    history: UnhydratedType["History"];
  };
};

// TODO remove
export const vars = {
  journalId: makeVar(uuidv4()),
  journalTitle: makeVar("new journal"),
  journalMetadata: makeVar({ lastArcHue: 0 }),
  entries: makeVar<{ [entryKey in string]: UnhydratedType["Entry"] }>({}),
  journalEntries: makeVar<{
    [entryKey in string]: UnhydratedType["JournalEntry"];
  }>({}),
  arcEntries: makeVar<{ [entryKey in string]: UnhydratedType["ArcEntry"] }>({}),
  commentEntries: makeVar<{
    [entryKey in string]: UnhydratedType["CommentEntry"];
  }>({}),
  arcs: makeVar<{ [id in string]: UnhydratedType["Arc"] }>({}),
  highlights: makeVar<{ [id in string]: UnhydratedType["Highlight"] }>({}),
  relations: makeVar<{ [id in string]: UnhydratedType["Relation"] }>({}),
  days: makeVar<{ [day in string]: UnhydratedType["Day"] }>({}),
  comments: makeVar<{ [id in string]: UnhydratedType["Comment"] }>({}),
};

// @ts-expect-error Expose vars for debugging
global.apollo_vars = vars;

// TODO remove
export const serializeVars: (keyof typeof vars)[] = [
  "journalId",
  "journalTitle",
  "journalMetadata",
  "entries",
  "arcs",
  "journalEntries",
  "arcEntries",
  "commentEntries",
  "highlights",
  "relations",
  "comments",
  "days",
];

export const initializeState = async () => {
  // Cancels "watches" on queries. Because all queries will update on each
  // reactive var call, resetting one might trigger a query update that could
  // cause errors.
  await client.clearStore();
  vars.journalId(uuidv4());
  vars.journalTitle("new journal");
  vars.journalMetadata({ lastArcHue: 0 });
  vars.entries({});
  vars.arcs({});
  vars.journalEntries({});
  vars.arcEntries({});
  vars.commentEntries({});
  vars.highlights({});
  vars.relations({});
  vars.days({});
  vars.comments({});
};

// TODO remove
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
      ...ArcResolvers.Query.fields,
      ...RelationResolvers.Query.fields,
      ...HighlightResolvers.Query.fields,
      ...SearchResolvers.Query.fields,
      ...ArcResolvers.Query.fields,
      ...DayResolvers.Query.fields,
      ...JournalEntryResolvers.Query.fields,
      ...CommentResolvers.Query.fields,
      ...CommentEntryResolvers.Query.fields,
    },
  },
  Entry: EntryResolvers.Entry,
  ArcEntry: ArcEntryResolvers.ArcEntry,
  Relation: RelationResolvers.Relation,
  Arc: ArcResolvers.Arc,
  Highlight: HighlightResolvers.Highlight,
  ImportanceRating: HighlightResolvers.ImportanceRating,
  Day: DayResolvers.Day,
  JournalEntry: JournalEntryResolvers.JournalEntry,
  Comment: CommentResolvers.Comment,
  CommentEntry: CommentEntryResolvers.CommentEntry,
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
    relationTypeDef,
    arcTypeDef,
    searchTypeDef,
    highlightTypeDef,
    dayTypeDef,
    journalEntryTypeDef,
    commentTypeDef,
    commentEntryTypeDef,
  ],
  link: from([errorLink]),
});
