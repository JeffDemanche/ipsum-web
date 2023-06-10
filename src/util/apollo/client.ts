import {
  ApolloClient,
  InMemoryCache,
  // eslint-disable-next-line import/named
  TypePolicies,
  gql,
  makeVar,
} from "@apollo/client";
import { parseIpsumDateTime } from "util/dates";
import { v4 as uuidv4 } from "uuid";
import {
  QueryArcsArgs,
  QueryEntriesArgs,
  QueryHighlightsArgs,
  QueryRelationsArgs,
} from "./__generated__/graphql";

const typeDefs = gql`
  type Query {
    journalId: String!
    journalTitle: String!
    journalMetadata: JournalMetadata!

    entry(entryKey: ID!): Entry
    entries(entryKeys: [ID!]): [Entry]
    recentEntries(count: Int!): [Entry!]!
    entryDates: [String!]!

    arc(id: ID!): Arc
    arcs(ids: [ID!]): [Arc]

    highlight(id: ID!): Highlight
    highlights(ids: [ID!], entries: [ID!], arcs: [ID!]): [Highlight]

    relation(id: ID!): Relation
    relations(ids: [ID!]): [Relation]
  }

  type JournalMetadata {
    lastArcHue: Int!
  }

  type Entry {
    entryKey: String!
    date: String!
    contentState: String!
    highlights: [Highlight!]!
  }

  type Arc {
    id: ID!
    name: String!
    color: Int!
    highlights: [Highlight!]!

    incomingRelations: [Relation!]!
    outgoingRelations: [Relation!]!
  }

  type Highlight {
    id: ID!
    entry: Entry!
    arc: Arc
    arcs: [Arc!]!
    outgoingRelations: [Relation!]!
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
  JournalMetadata: {
    __typename: "JournalMetadata";
    lastArcHue: number;
  };
  Entry: {
    __typename: "Entry";
    entryKey: string;
    date: string;
    contentState: string;
  };
  Arc: {
    __typename: "Arc";
    id: string;
    name: string;
    color: number;
    incomingRelations: string[];
    outgoingRelations: string[];
  };
  Highlight: {
    __typename: "Highlight";
    id: string;
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
};

export const vars = {
  journalId: makeVar(uuidv4()),
  journalTitle: makeVar("new journal"),
  journalMetadata: makeVar({ lastArcHue: 0 }),
  entries: makeVar<{ [entryKey in string]: UnhydratedType["Entry"] }>({}),
  arcs: makeVar<{ [id in string]: UnhydratedType["Arc"] }>({}),
  highlights: makeVar<{ [id in string]: UnhydratedType["Highlight"] }>({}),
  relations: makeVar<{ [id in string]: UnhydratedType["Relation"] }>({}),
};

// @ts-expect-error Expose vars for debugging
global.apollo_vars = vars;

export const serializeVars: (keyof typeof vars)[] = [
  "journalId",
  "journalTitle",
  "journalMetadata",
  "entries",
  "arcs",
  "highlights",
  "relations",
];

export const initializeState = () => {
  vars.journalId(uuidv4());
  vars.journalTitle("new journal");
  vars.journalMetadata({ lastArcHue: 0 });
  vars.entries({});
  vars.arcs({});
  vars.highlights({});
  vars.relations({});
};

const typePolicies: TypePolicies = {
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
              parseIpsumDateTime(b.date).dateTime.toJSDate().getTime() -
              parseIpsumDateTime(a.date).dateTime.toJSDate().getTime()
          )
          .slice(0, args.count);
      },
      entryDates() {
        return Object.values(vars.entries()).map((entry) => entry.date);
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
      highlight(_, { args }) {
        if (args?.id) {
          return vars.highlights()[args.id];
        }
        return undefined;
      },
      highlights(_, { args }: { args?: QueryHighlightsArgs }) {
        if (args?.ids && !args?.entries) {
          return args.ids.map((id) => vars.highlights()[id]);
        } else if (args?.ids || args?.entries || args?.arcs) {
          return Object.values(vars.highlights()).filter((highlight) => {
            const highlightRelations = highlight.outgoingRelations
              .map((relation) => vars.relations()[relation])
              .filter((relation) => relation.objectType === "Arc");
            const arcsIntersection = highlightRelations.filter((relation) =>
              args.arcs?.includes(relation.object)
            );

            return (
              (!args.ids || args.ids.includes(highlight.id)) &&
              (!args.entries || args.entries.includes(highlight.entry)) &&
              (!args.arcs || arcsIntersection.length > 0)
            );
          });
        }
        return Object.values(vars.highlights());
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
    },
  },
  Highlight: {
    keyFields: ["id"],
    fields: {
      arc(_, { readField }) {
        const outgoingRelations =
          readField<{ __typename: "Relation"; object: string }[]>(
            "outgoingRelations"
          );
        return outgoingRelations.length
          ? vars.arcs()[outgoingRelations[0].object]
          : null;
      },
      arcs(_, { readField }) {
        const outgoingRelations =
          readField<{ __typename: "Relation"; object: string }[]>(
            "outgoingRelations"
          );
        return outgoingRelations.map(
          (relation) => vars.arcs()[relation.object]
        );
      },
      entry(entryKey) {
        return vars.entries()[entryKey];
      },
      outgoingRelations(relationIds: string[]) {
        return relationIds.map((id) => vars.relations()[id]);
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
};

const cache = new InMemoryCache({ typePolicies, addTypename: true });

export const client = new ApolloClient({ cache, typeDefs });
