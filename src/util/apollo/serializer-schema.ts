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
          trackedHTMLString: t.string,
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
          importanceRatings: t.array(
            t.type({
              __typename: t.literal("ImportanceRating"),
              day: t.string,
              value: t.number,
            })
          ),
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
    srsCardReviews: t.record(
      t.string,
      t.type({
        __typename: t.literal("SRSCardReview"),
        id: t.string,
        card: t.string,
        day: t.string,
        rating: t.number,
        beforeInterval: t.number,
        afterInterval: t.number,
        beforeEF: t.number,
        afterEF: t.number,
      })
    ),
    srsCards: t.record(
      t.string,
      t.type({
        __typename: t.literal("SRSCard"),
        id: t.string,
        lastReviewed: t.string,
        interval: t.number,
        ef: t.number,
        subjectType: t.union([t.literal("Arc"), t.literal("Highlight")]),
        subject: t.string,
        endDate: t.union([t.string, t.undefined]),
        deck: t.string,
        reviews: t.array(t.string),
        history: HistorySchema,
      })
    ),
    srsDecks: t.record(
      t.string,
      t.type({
        __typename: t.literal("SRSDeck"),
        id: t.string,
        cards: t.array(t.string),
      })
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
    days: t.record(
      t.string,
      t.type(
        {
          __typename: t.literal("Day"),
          day: t.string,
          journalEntry: t.union([t.string, t.undefined]),
          ratedHighlights: t.array(t.string),
          changedArcEntries: t.array(t.string),
          comments: t.array(t.string),
          srsCardReviews: t.array(t.string),
        },
        "day"
      ),
      "days"
    ),
  },
  "root"
);
