import { InMemoryJournalMetadata, InMemoryState } from "./in-memory-state";

export type JournalAction =
  | {
      type: "UPDATE-JOURNAL-METADATA";
      payload: Parameters<
        typeof journalDispatchers["UPDATE-JOURNAL-METADATA"]
      >["1"];
    }
  | {
      type: "UPDATE-JOURNAL-TITLE";
      payload: Parameters<
        typeof journalDispatchers["UPDATE-JOURNAL-TITLE"]
      >["1"];
    };

export const journalDispatchers = {
  "UPDATE-JOURNAL-METADATA": (
    state: InMemoryState,
    payload: { journalMetadata: Partial<InMemoryJournalMetadata> }
  ): InMemoryState => {
    const copy = { ...state };
    copy.journalMetadata = {
      ...copy.journalMetadata,
      ...payload.journalMetadata,
    };
    return copy;
  },
  "UPDATE-JOURNAL-TITLE": (
    state: InMemoryState,
    payload: { title: string }
  ): InMemoryState => {
    return { ...state, journalTitle: payload.title };
  },
};
