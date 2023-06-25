import { UnhydratedType, vars } from "../client";

/**
 * Allows mocks to supply partials of types, with the unsupplied fields being
 * set to defaults.
 */
const defaultize = <T>(
  obj: { [id in string]: Partial<T> },
  defaults: T
): { [id in string]: T } => {
  return Object.fromEntries(
    Object.entries(obj).map(([id, obj]) => [id, { ...defaults, ...obj }])
  );
};

export const mockJournalMetadata = (
  metadata: Partial<UnhydratedType["JournalMetadata"]>
) => {
  vars.journalMetadata({
    ...metadata,
    lastArcHue: 0,
  });
};

export const mockEntries = (entries: {
  [entryKey in string]: Partial<UnhydratedType["Entry"]>;
}) => {
  vars.entries(
    defaultize<UnhydratedType["Entry"]>(entries, {
      __typename: "Entry",
      entryKey: "",
      contentState: "",
      date: new Date().toISOString(),
    })
  );
};

export const mockArcs = (arcs: {
  [id in string]: Partial<UnhydratedType["Arc"]>;
}) => {
  vars.arcs(
    defaultize<UnhydratedType["Arc"]>(arcs, {
      __typename: "Arc",
      id: "",
      color: 0,
      name: "",
      arcEntry: "",
      history: { __typename: "History" },
      incomingRelations: [],
      outgoingRelations: [],
    })
  );
};

export const mockHighlights = (highlight: {
  [id in string]: Partial<UnhydratedType["Highlight"]>;
}) => {
  vars.highlights(
    defaultize<UnhydratedType["Highlight"]>(highlight, {
      __typename: "Highlight",
      id: "",
      entry: "",
      history: { __typename: "History" },
      outgoingRelations: [],
    })
  );
};

export const mockRelations = (relations: {
  [id in string]: Partial<UnhydratedType["Relation"]>;
}) => {
  vars.relations(
    defaultize<UnhydratedType["Relation"]>(relations, {
      __typename: "Relation",
      id: "",
      object: "",
      objectType: "Arc",
      subject: "",
      subjectType: "Arc",
      predicate: "relates to",
    })
  );
};
