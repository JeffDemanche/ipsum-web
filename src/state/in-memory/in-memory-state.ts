import { DateTime } from "luxon";
import { IpsumDateTime } from "util/dates";
import { dispatch, InMemoryAction } from "./in-memory-actions";
import { v4 as uuidv4 } from "uuid";

export interface InMemoryEntry {
  entryKey: string;
  date: IpsumDateTime;
  contentState: string;
}

export interface InMemoryArc {
  id: string;
  name: string;
  color: number;
}

const ArcDefaults: InMemoryArc = {
  id: "null",
  name: "",
  color: 0,
};

export interface InMemoryArcAssignment {
  id: string;
  arcId: string;
  entryKey: string;
}

export interface InMemoryJournalMetadata {
  lastArcHue: number;
}

const JournalMetadataDefaults: InMemoryJournalMetadata = {
  lastArcHue: 0,
};

export interface InMemoryState {
  journalId: string;
  journalTitle: string;
  journalMetadata: InMemoryJournalMetadata;
  entries: { [entryKey: string]: InMemoryEntry };
  arcs: { [id: string]: InMemoryArc };
  arcAssignments: { [id: string]: InMemoryArcAssignment };
}

export const stateReviver: Parameters<typeof JSON.parse>[1] = (key, value) => {
  switch (key as keyof InMemoryState) {
    case "entries": {
      const revivedEntries: { [id: string]: InMemoryEntry } = {};
      Object.keys(value as { [id: string]: InMemoryEntry }).forEach(
        (entryKey) => {
          revivedEntries[entryKey] = {
            ...value[entryKey],
            date: new IpsumDateTime(DateTime.fromISO(value._luxonDateTime)),
          };
        }
      );
      return revivedEntries;
    }
    case "arcs": {
      const revivedArcs: { [id: string]: InMemoryArc } = {};
      Object.keys(value as { [id: string]: InMemoryArc }).forEach((arcKey) => {
        revivedArcs[arcKey] = { ...ArcDefaults, ...value[arcKey] };
      });
      return revivedArcs;
    }
    case "journalMetadata": {
      return { ...JournalMetadataDefaults, ...value };
    }
  }
  return value;
};

export const initialInMemoryState: InMemoryState = {
  journalId: uuidv4(),
  journalTitle: "new journal",
  journalMetadata: { lastArcHue: 0 },
  entries: {},
  arcs: {},
  arcAssignments: {},
};

export const reducer = (
  state: InMemoryState,
  action: InMemoryAction
): InMemoryState => {
  return dispatch(state, action);
};
