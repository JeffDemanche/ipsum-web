import { serializeVars, vars } from "./client";

import * as t from "io-ts";

const SerializedSchema = t.type({
  journalId: t.string,
  journalTitle: t.string,
  journalMetadata: t.type({
    lastArcHue: t.number,
  }),
  entries: t.array(
    t.type({
      entryKey: t.string,
      date: t.string,
      contentState: t.string,
    })
  ),
  arcs: t.array(
    t.type({
      id: t.string,
      name: t.string,
      color: t.number,
    })
  ),
  highlights: t.array(
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
export const writeApolloState = (): object => {
  return serializeVars.reduce((prev, curr) => {
    return {
      ...prev,
      [curr]: vars[curr](),
    };
  }, {});
};

/**
 * Load a string from disk into Apollo state.
 */
export const loadApolloState = (serialized: string): void => {
  const parsed = SerializedSchema.decode(JSON.parse(serialized));

  if (parsed._tag === "Left") {
    parsed.left;
    throw new Error("Failed to parse serialized Apollo state");
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
