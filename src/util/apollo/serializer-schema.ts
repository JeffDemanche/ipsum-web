import * as t from "io-ts";

const HistorySchema = t.type({
  __typename: t.literal("History"),
  dateCreated: t.union([t.string, t.undefined]),
});

export const SerializedSchema = t.type(
  {
    journalId: t.string,
    journalTitle: t.string,
    journalMetadata: t.type(
      {
        lastArcHue: t.number,
      },
      "journalMetadata"
    ),
    entries: t.record(
      t.string,
      t.type(
        {
          __typename: t.literal("Entry"),
          entryKey: t.string,
          trackedContentState: t.string,
          history: HistorySchema,
          entryType: t.union([
            t.literal("JOURNAL"),
            t.literal("ARC"),
            t.literal("COMMENT"),
          ]),
        },
        "entry"
      ),
      "entries"
    ),
    journalEntries: t.record(
      t.string,
      t.type(
        {
          __typename: t.literal("JournalEntry"),
          entryKey: t.string,
          entry: t.string,
        },
        "journalEntry"
      ),
      "journalEntries"
    ),
    arcEntries: t.record(
      t.string,
      t.type(
        {
          __typename: t.literal("ArcEntry"),
          entry: t.string,
          arc: t.string,
        },
        "arcEntry"
      ),
      "arcEntries"
    ),
    commentEntries: t.record(
      t.string,
      t.type(
        {
          __typename: t.literal("CommentEntry"),
          entry: t.string,
          comment: t.string,
        },
        "commentEntry"
      ),
      "commentEntries"
    ),
    arcs: t.record(
      t.string,
      t.type(
        {
          __typename: t.literal("Arc"),
          id: t.string,
          history: HistorySchema,
          name: t.string,
          color: t.number,
          arcEntry: t.string,
          incomingRelations: t.array(t.string),
          outgoingRelations: t.array(t.string),
        },
        "arc"
      ),
      "arcs"
    ),
    highlights: t.record(
      t.string,
      t.type(
        {
          __typename: t.literal("Highlight"),
          id: t.string,
          history: HistorySchema,
          entry: t.string,
          outgoingRelations: t.array(t.string),
        },
        "highlight"
      ),
      "highlights"
    ),
    relations: t.record(
      t.string,
      t.type(
        {
          __typename: t.literal("Relation"),
          id: t.string,
          subjectType: t.union([t.literal("Arc"), t.literal("Highlight")]),
          subject: t.string,
          predicate: t.string,
          objectType: t.literal("Arc"),
          object: t.string,
        },
        "relation"
      ),
      "relations"
    ),
    comments: t.record(
      t.string,
      t.type(
        {
          __typename: t.literal("Comment"),
          id: t.string,
          history: HistorySchema,
          commentEntry: t.string,
        },
        "comment"
      ),
      "comments"
    ),
  },
  "root"
);