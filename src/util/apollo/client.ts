import { ApolloClient, InMemoryCache, gql, makeVar } from "@apollo/client";
import { parseIpsumDateTime } from "util/dates";
import { IpsumTimeMachine } from "util/diff";
import { v4 as uuidv4 } from "uuid";
import { HighlightResolvers } from "./resolvers/highlight-resolvers";
import { SRSResolvers } from "./resolvers/srs-resolvers";
import { StrictTypedTypePolicies } from "./__generated__/apollo-helpers";
import {
  QueryArcEntriesArgs,
  QueryArcsArgs,
  QueryEntriesArgs,
  QueryRelationsArgs,
  QueryJournalEntriesArgs,
} from "./__generated__/graphql";

const typeDefs = gql`
  type Query {
    journalId: String!
    journalTitle: String!
    journalMetadata: JournalMetadata!

    entry(entryKey: ID!): Entry
    entries(entryKeys: [ID!]): [Entry]
    recentEntries(count: Int!): [Entry!]!
    entryKeys: [String!]!

    recentJournalEntries(count: Int!): [JournalEntry!]!
    journalEntryDates: [String!]!

    journalEntry(entryKey: ID!): JournalEntry
    journalEntries(entryKeys: [ID!]): [JournalEntry]

    arcEntry(arcId: ID!): ArcEntry
    arcEntries(entryKeys: [ID!]): [ArcEntry]

    arc(id: ID!): Arc
    arcs(ids: [ID!]): [Arc]

    highlight(id: ID!): Highlight
    highlights(ids: [ID!], entries: [ID!], arcs: [ID!]): [Highlight]

    relation(id: ID!): Relation
    relations(ids: [ID!]): [Relation]

    srsCard(id: ID!): SRSCard
    srsCardsForReview(deckId: ID, day: String!): [SRSCard!]!
    srsReviewsFromDay(deckId: ID, day: String!): [SRSCardReview!]!
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
    # Resolves to most recent tracked contentState
    contentState: String!
    trackedContentState: String!
    highlights: [Highlight!]!
    entryType: EntryType!
    history: History!
  }

  type JournalEntry {
    entryKey: String!
    entry: Entry!
  }

  type ArcEntry {
    entry: Entry!
    arc: Arc!
  }

  type CommentEntry {
    entry: Entry!
    comment: Comment!
  }

  type Arc {
    id: ID!
    name: String!
    color: Int!
    highlights: [Highlight!]!
    history: History!
    arcEntry: ArcEntry!

    incomingRelations: [Relation!]!
    outgoingRelations: [Relation!]!
  }

  type Highlight {
    id: ID!
    history: History!
    entry: Entry!
    arc: Arc
    arcs: [Arc!]!
    outgoingRelations: [Relation!]!
    srsCards: [SRSCard!]!
  }

  union RelationSubject = Arc | Highlight

  type Relation {
    id: ID!
    subject: RelationSubject!
    predicate: String!
    object: Arc!
  }

  type Day {
    day: String!
    journalEntry: JournalEntry
    changedArcEntries: [ArcEntry!]
    comments: [Comment!]
    srsCardReviews: [SRSCardReview!]
  }

  union SRSCardSubject = Arc | Highlight

  type SRSCard {
    id: ID!
    lastReviewed: String!
    interval: Float!
    ef: Float!
    subject: SRSCardSubject!
    endDate: String
    deck: SRSDeck!
    reviews: [SRSCardReview!]!
  }

  type SRSCardReview {
    id: ID!
    card: SRSCard!
    day: Day!
    rating: Int!
    beforeInterval: Float!
    beforeEF: Float!
    afterInterval: Float!
    afterEF: Float!
  }

  type SRSDeck {
    id: ID!
    cards: [SRSCard!]!
  }

  # TODO
  type Comment {
    id: ID!
    commentEntry: CommentEntry!
    history: History!
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
    trackedContentState: string;
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
  Highlight: {
    __typename: "Highlight";
    id: string;
    history: UnhydratedType["History"];
    entry: string;
    outgoingRelations: string[];
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
    changedArcEntries: string[];
    comments: string[];
    srsCardReviews: string[];
  };
  SRSCardReview: {
    __typename: "SRSCardReview";
    id: string;
    card: string;
    day: string;
    rating: number;
    beforeInterval: number;
    beforeEF: number;
    afterInterval: number;
    afterEF: number;
  };
  SRSCard: {
    __typename: "SRSCard";
    id: string;
    lastReviewed: string;
    interval: number;
    ef: number;
    subjectType: "Arc" | "Highlight";
    subject: string;
    endDate?: string;
    deck: string;
    reviews: string[];
    history: UnhydratedType["History"];
  };
  SRSDeck: {
    __typename: "SRSDeck";
    id: string;
    cards: string[];
  };
  Comment: {
    __typename: "Comment";
    id: string;
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
  srsCardReviews: makeVar<{ [id in string]: UnhydratedType["SRSCardReview"] }>(
    {}
  ),
  srsCards: makeVar<{ [id in string]: UnhydratedType["SRSCard"] }>({}),
  srsDecks: makeVar<{ [id in string]: UnhydratedType["SRSDeck"] }>({}),
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
  "srsCards",
  "srsCardReviews",
  "srsDecks",
  "comments",
];

export const initializeState = () => {
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
  vars.srsCards({});
  vars.srsCardReviews({});
  vars.srsDecks({
    default: {
      __typename: "SRSDeck",
      id: "default",
      cards: [],
    },
  });
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
      journalEntry(_, { args }) {
        if (args.entryKey) {
          return vars.journalEntries()[args.entryKey] ?? null;
        }
        return null;
      },
      journalEntries(_, { args }: { args: QueryJournalEntriesArgs }) {
        if (args?.entryKeys) {
          return args.entryKeys
            .map((entryKey) => vars.journalEntries()[entryKey])
            .filter(Boolean);
        }
        return Object.values(vars.journalEntries());
      },
      entryKeys() {
        return Object.values(vars.entries()).map((entry) => entry.entryKey);
      },
      recentJournalEntries(_, { args }) {
        return Object.values(vars.entries())
          .filter((entry) => entry.entryType === "JOURNAL")
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
      arc(_, { args }) {
        if (args?.id) {
          return vars.arcs()[args.id];
        }
        return null;
      },
      arcs(_, { args }: { args: QueryArcsArgs }) {
        if (args?.ids) {
          return args.ids.map((id) => vars.arcs()[id]);
        }
        return Object.values(vars.arcs());
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
      ...SRSResolvers.Query.fields,
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
      contentState(_, { readField }) {
        const trackedContentState = readField<string>("trackedContentState");
        const timeMachine = IpsumTimeMachine.fromString(trackedContentState);
        return timeMachine.currentValue;
      },
      history(h) {
        return h;
      },
    },
  },
  JournalEntry: {
    keyFields: ["entryKey"],
    fields: {
      entry(_, { readField }) {
        return vars.entries()[readField<string>("entryKey")];
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
        return vars.entries()[entryKey];
      },
    },
  },
  Arc: {
    keyFields: ["id"],
    fields: {
      highlights(_, { readField }) {
        return Object.values(vars.highlights()).filter((highlight) => {
          return highlight.outgoingRelations.some(
            (relation) => vars.relations()[relation].object === readField("id")
          );
        });
      },
      incomingRelations(relationIds: string[]) {
        return relationIds.map((id) => vars.relations()[id]);
      },
      outgoingRelations(relationIds: string[]) {
        return relationIds.map((id) => vars.relations()[id]);
      },
      arcEntry(arcEntryKey) {
        return vars.arcEntries()[arcEntryKey];
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
  Highlight: HighlightResolvers.Highlight,
};

const cache = new InMemoryCache({ typePolicies, addTypename: true });

export const client = new ApolloClient({
  cache,
  typeDefs,
});
