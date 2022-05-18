import { ContentState } from "draft-js";

export interface InMemoryJournal {
  loadedEntries: ReadonlyMap<string, Entry>;

  getAllEntryKeys: () => Promise<ReadonlySet<string>>;

  loadEntry: (date: string) => void;
  unloadEntry: (date: string) => void;

  createOrUpdateEntry: (
    date: string,
    contentState: ContentState
  ) => Promise<void>;
  deleteEntry: (entryKey: string) => Promise<void>;
}

export interface Entry {
  date: string;
  contentState: ContentState;
}

export interface Arc {
  canonicalName: string;
}
