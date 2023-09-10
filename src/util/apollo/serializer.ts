import { serializeVars, vars } from "./client";

import { PathReporter } from "io-ts/PathReporter";
import { SerializedSchema } from "./serializer-schema";

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
    vars.srsCardReviews(parsed.right.srsCardReviews);
    vars.srsCards(parsed.right.srsCards);
    vars.srsDecks(parsed.right.srsDecks);
    vars.comments(parsed.right.comments);
  }
};
