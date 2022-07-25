import { DateTime } from "luxon";
import { IpsumDateTime } from "util/dates";
import { dispatch, InMemoryAction } from "./in-memory-actions";

export interface InMemoryEntry {
  entryKey: string;
  date: IpsumDateTime;
  contentState: string;
}

export interface InMemoryArc {
  name: string;
}

export interface InMemoryState {
  journalTitle: string;
  entries: { [entryKey: string]: InMemoryEntry };
  arcs: { [arcKey: string]: InMemoryArc };
}

export const stateReviver: Parameters<typeof JSON.parse>[1] = (key, value) => {
  switch (key) {
    case "date":
      return new IpsumDateTime(DateTime.fromISO(value._luxonDateTime));
  }
  return value;
};

export const initialInMemoryState: InMemoryState = {
  journalTitle: "new journal",
  entries: {},
  arcs: {},
};

export const reducer = (
  state: InMemoryState,
  action: InMemoryAction
): InMemoryState => {
  return dispatch(state, action);
};
