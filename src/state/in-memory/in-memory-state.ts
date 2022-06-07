import { IpsumDateTime } from "util/dates";
import { dispatch, InMemoryAction } from "./in-memory-actions";

interface InMemoryEntry {
  entryKey: string;
  date: IpsumDateTime;
  contentState: string;
}

interface InMemoryArc {
  name: string;
}

export interface InMemoryState {
  entries: { [entryKey: string]: InMemoryEntry };
  arcs: { [arcKey: string]: InMemoryArc };
}

export const initialInMemoryState: InMemoryState = null;

export const reducer = (
  state: InMemoryState,
  action: InMemoryAction
): InMemoryState => {
  return dispatch(state, action);
};
