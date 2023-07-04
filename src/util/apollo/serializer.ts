import { serializeVars, vars } from "./client";

import * as t from "io-ts";
import { PathReporter } from "io-ts/PathReporter";

const HistorySchema = t.type({
  __typename: t.literal("History"),
  dateCreated: t.union([t.string, t.undefined]),
});

const SerializedSchema = t.type({
  journalId: t.string,
  journalTitle: t.string,
  journalMetadata: t.type({
    lastArcHue: t.number,
  }),
  entries: t.record(
    t.string,
    t.type({
      __typename: t.literal("Entry"),
      entryKey: t.string,
      trackedContentState: t.string,
      history: HistorySchema,
      entryType: t.union([
        t.literal("JOURNAL"),
        t.literal("ARC"),
        t.literal("COMMENT"),
      ]),
    })
  ),
  journalEntries: t.record(
    t.string,
    t.type({
      __typename: t.literal("JournalEntry"),
      entryKey: t.string,
      entry: t.string,
    })
  ),
  arcEntries: t.record(
    t.string,
    t.type({
      __typename: t.literal("ArcEntry"),
      entry: t.string,
      arc: t.string,
    })
  ),
  commentEntries: t.record(
    t.string,
    t.type({
      __typename: t.literal("CommentEntry"),
      entry: t.string,
      comment: t.string,
    })
  ),
  arcs: t.record(
    t.string,
    t.type({
      __typename: t.literal("Arc"),
      id: t.string,
      history: HistorySchema,
      name: t.string,
      color: t.number,
      arcEntry: t.string,
      incomingRelations: t.array(t.string),
      outgoingRelations: t.array(t.string),
    })
  ),
  highlights: t.record(
    t.string,
    t.type({
      __typename: t.literal("Highlight"),
      id: t.string,
      history: HistorySchema,
      entry: t.string,
      outgoingRelations: t.array(t.string),
    })
  ),
  relations: t.record(
    t.string,
    t.type({
      __typename: t.literal("Relation"),
      id: t.string,
      subjectType: t.union([t.literal("Arc"), t.literal("Highlight")]),
      subject: t.string,
      predicate: t.string,
      objectType: t.literal("Arc"),
      object: t.string,
    })
  ),
  comments: t.record(
    t.string,
    t.type({
      __typename: t.literal("Comment"),
      id: t.string,
      history: HistorySchema,
      commentEntry: t.string,
    })
  ),
});

/**
 * Converts Apollo state into a string to be written to disk.
 */
export const writeApolloState = (): string => {
  return JSON.stringify(
    serializeVars.reduce((prev, curr) => {
      return {
        ...prev,
        [curr]: vars[curr](),
      };
    }, {})
  );
};

/**
 * Load a string from disk into Apollo state. Returns an array of validation
 * errors, if they occurred.
 */
export const loadApolloState = (serialized: string): string[] | undefined => {
  const raw = JSON.parse(serialized);
  const parsed = SerializedSchema.decode(raw);

  if (parsed._tag === "Left") {
    PathReporter.report(parsed).forEach((error) => console.error(error));
    return PathReporter.report(parsed);
  } else {
    vars.journalId(parsed.right.journalId);
    vars.journalMetadata(parsed.right.journalMetadata);
    vars.journalTitle(parsed.right.journalTitle);
    vars.entries(parsed.right.entries);
    vars.journalEntries(parsed.right.journalEntries);
    vars.arcEntries(parsed.right.arcEntries);
    vars.commentEntries(parsed.right.commentEntries);
    vars.arcs(parsed.right.arcs);
    vars.highlights(parsed.right.highlights);
    vars.relations(parsed.right.relations);
    vars.comments(parsed.right.comments);
  }
};
