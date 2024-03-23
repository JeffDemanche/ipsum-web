import { ApolloClient, InMemoryCache, gql, makeVar } from "@apollo/client";
import { parseIpsumDateTime } from "util/dates";
import { IpsumTimeMachine } from "util/diff";
import { v4 as uuidv4 } from "uuid";
import { ArcResolvers } from "./resolvers/arc-resolvers";
import { HighlightResolvers } from "./resolvers/highlight-resolvers";
import { SearchResolvers } from "./resolvers/search-resolvers";
import { arcTypeDef } from "./schemas/arc-schema";
import { highlightTypeDef } from "./schemas/highlight-schema";
import { searchTypeDef } from "./schemas/search-schema";
import { StrictTypedTypePolicies } from "./__generated__/apollo-helpers";
import {
  QueryArcEntriesArgs,
  QueryEntriesArgs,
  QueryRelationsArgs,
} from "./__generated__/graphql";
import { onError } from "@apollo/client/link/error";
import { dayTypeDef } from "./schemas/day-schema";
import { DayResolvers } from "./resolvers/day-resolvers";
import { journalEntryTypeDef } from "./schemas/journal-entry-schema";
import { JournalEntryResolvers } from "./resolvers/journal-entry-resolvers";
import { commentTypeDef } from "./schemas/comment-schema";
import { CommentResolvers } from "./resolvers/comment-resolvers";
import { commentEntryTypeDef } from "./schemas/comment-entry-schema";
import { CommentEntryResolvers } from "./resolvers/comment-entry-resolvers";

const typeDefs = gql`
  type Query {
    journalId: String!
    journalTitle: String!
    journalMetadata: JournalMetadata!

    entry(entryKey: ID!): Entry
    entries(entryKeys: [ID!]): [Entry]
    recentEntries(count: Int!): [Entry!]!
    entryKeys: [String!]!

    arcEntry(arcId: ID!): ArcEntry
    arcEntries(entryKeys: [ID!]): [ArcEntry]

    relation(id: ID!): Relation
    relations(ids: [ID!]): [Relation]
  }

  # Generalized type that can be used on objects that have a history
  type History {
    dateCreated: String
  }

  type JournalMetadata {
    lastArcHue: Int!
  }

  enum EntryType {
    JOURNAL
    ARC
    COMMENT
  }

  type Entry {
    entryKey: String!
    date: String!
    htmlString: String!
    trackedHTMLString: String!
    highlights: [Highlight!]!
    entryType: EntryType!
    history: History!
  }

  type ArcEntry {
    entry: Entry!
    arc: Arc!
  }

  union RelationSubject = Arc | Highlight

  type Relation {
    id: ID!
    subject: RelationSubject!
    predicate: String!
    object: Arc!
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

const typePolicies: StrictTypedTypePolicies = {
  Query: {
    fields: {
      journalId() {
        return vars.journalId();
      },
      journalTitle() {
        return vars.journalTitle();
      },
      journalMetadata() {
        return vars.journalMetadata();
      },
      entry(_, { args }) {
        if (args.entryKey) {
          return vars.entries()[args.entryKey] ?? null;
        }
        return null;
      },
      entries(_, { args }: { args: QueryEntriesArgs }) {
        if (args?.entryKeys) {
          return args.entryKeys
            .map((entryKey) => vars.entries()[entryKey])
            .filter(Boolean);
        }
        return Object.values(vars.entries());
      },
      recentEntries(_, { args }) {
        return Object.values(vars.entries())
          .sort(
            (a, b) =>
              parseIpsumDateTime(b.history.dateCreated)
                .dateTime.toJSDate()
                .getTime() -
              parseIpsumDateTime(a.history.dateCreated)
                .dateTime.toJSDate()
                .getTime()
          )
          .slice(0, args.count);
      },
      entryKeys() {
        return Object.values(vars.entries()).map((entry) => entry.entryKey);
      },
      arcEntry(_, { args }) {
        if (args?.arcId) {
          const arcEntryKey = Object.values(vars.arcs()).find(
            (arc) => arc.id === args.arcId
          ).arcEntry;
          return vars.arcEntries()[arcEntryKey];
        }
        return null;
      },
      arcEntries(_, { args }: { args: QueryArcEntriesArgs }) {
        if (args?.entryKeys) {
          return args.entryKeys.map((entryKey) => vars.arcEntries()[entryKey]);
        }
        return Object.values(vars.arcEntries());
      },
      relation(_, { args }) {
        if (args?.id) {
          return vars.relations()[args.id];
        }
        return undefined;
      },
      relations(_, { args }: { args?: QueryRelationsArgs }) {
        if (args?.ids) {
          return args.ids.map((id) => vars.relations()[id]);
        }
        return Object.values(vars.relations());
      },
      ...HighlightResolvers.Query.fields,
      ...SearchResolvers.Query.fields,
      ...ArcResolvers.Query.fields,
      ...DayResolvers.Query.fields,
      ...JournalEntryResolvers.Query.fields,
      ...CommentResolvers.Query.fields,
      ...CommentEntryResolvers.Query.fields,
    },
  },
  Entry: {
    keyFields: ["entryKey"],
    fields: {
      highlights(_, { readField }) {
        return Object.values(vars.highlights()).filter(
          (highlight) => highlight.entry === readField("entryKey")
        );
      },
      date(_, { readField }) {
        return readField<UnhydratedType["History"]>("history").dateCreated;
      },
      htmlString(_, { readField }) {
        const trackedHTMLString = readField<string>("trackedHTMLString");
        const timeMachine = IpsumTimeMachine.fromString(trackedHTMLString);
        return timeMachine.currentValue;
      },
      history(h) {
        return h;
      },
    },
  },
  ArcEntry: {
    keyFields: ["entry"],
    fields: {
      arc(arcId) {
        return vars.arcs()[arcId];
      },
      entry(entryKey) {
        const entry = vars.entries()[entryKey];
        if (!entry) {
          throw new Error(`No entry found with key: ${entryKey}`);
        }
        return entry;
      },
    },
  },
  Relation: {
    keyFields: ["id"],
    fields: {
      subject(subjectId: string, { readField }) {
        const id: string = readField("id");
        const type = vars.relations()[id].subjectType;
        if (type === "Arc") {
          return vars.arcs()[subjectId];
        } else if (type === "Highlight") {
          return vars.highlights()[subjectId];
        }
      },
      object(objectId: string, { readField }) {
        const id: string = readField("id");
        const type = vars.relations()[id].objectType;

        if (type === "Arc") {
          return vars.arcs()[objectId];
        }
      },
    },
  },
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
    arcTypeDef,
    searchTypeDef,
    highlightTypeDef,
    dayTypeDef,
    journalEntryTypeDef,
    commentTypeDef,
    commentEntryTypeDef,
  ],
  link: errorLink,
});
