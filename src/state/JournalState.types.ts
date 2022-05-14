export interface InMemoryJournal {
  loadedEntries: Entry[];
}

export interface Entry {
  id: string;
  date: string;
}

export interface Arc {
  id: string;
  canonicalName: string;
}
