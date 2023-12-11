import { IpsumDateTime } from "util/dates";
import { IpsumTimeMachine } from "util/diff";
import { UnhydratedType, vars } from "../client";
import { EntryType } from "../__generated__/graphql";

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
      trackedContentState: IpsumTimeMachine.create("").toString(),
      trackedHTMLString: IpsumTimeMachine.create("").toString(),
      history: {
        __typename: "History",
        dateCreated: IpsumDateTime.now().toString("iso"),
      },
      entryType: EntryType.Journal,
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

export const mockJournalEntries = (journalEntries: {
  [id in string]: Partial<UnhydratedType["JournalEntry"]>;
}) => {
  vars.journalEntries(
    defaultize<UnhydratedType["JournalEntry"]>(journalEntries, {
      __typename: "JournalEntry",
      entryKey: "",
      entry: "",
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
