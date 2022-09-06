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

export interface InMemoryArcAssignment {
  id: string;
  arcId: string;
  entryKey: string;
}

export interface InMemoryState {
  journalId: string;
  journalTitle: string;
  entries: { [entryKey: string]: InMemoryEntry };
  arcs: { [id: string]: InMemoryArc };
  arcAssignments: { [id: string]: InMemoryArcAssignment };
}

export const stateReviver: Parameters<typeof JSON.parse>[1] = (key, value) => {
  switch (key) {
    case "date":
      return new IpsumDateTime(DateTime.fromISO(value._luxonDateTime));
  }
  return value;
};

export const initialInMemoryState: InMemoryState = {
  journalId: uuidv4(),
  journalTitle: "new journal",
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
