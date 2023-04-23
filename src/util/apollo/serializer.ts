import { serializeVars, vars } from "./client";

import * as t from "io-ts";
import { PathReporter } from "io-ts/PathReporter";

const SerializedSchema = t.type({
  journalId: t.string,
  journalTitle: t.string,
  journalMetadata: t.type({
    lastArcHue: t.number,
  }),
  entries: t.record(
    t.string,
    t.type({
      entryKey: t.string,
      date: t.string,
      contentState: t.string,
    })
  ),
  arcs: t.record(
    t.string,
    t.type({
      id: t.string,
      name: t.string,
      color: t.number,
    })
  ),
  highlights: t.record(
    t.string,
    t.type({
      id: t.string,
      arc: t.string,
      entry: t.string,
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
    return PathReporter.report(parsed);
  } else {
    serializeVars.forEach((varName) => {
      const reactiveVarMap = {
        journalId: vars.journalId.bind(vars),
        journalTitle: vars.journalTitle.bind(vars),
        journalMetadata: vars.journalMetadata.bind(vars),
        entries: vars.entries.bind(vars),
        arcs: vars.arcs.bind(vars),
        highlights: vars.highlights.bind(vars),
      };

      reactiveVarMap[varName](parsed.right[varName]);
    });
  }
};
