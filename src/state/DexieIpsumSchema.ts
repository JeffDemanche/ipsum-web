import Dexie, { Table } from "dexie";

export interface DexieEntry {
  entryKey: string;
}

/**
 * A wrapper on Dexie that defines the schema for the IndexedDB data storage
 * strategy.
 */
export class DexieIpsumSchema extends Dexie {
  entries!: Table<DexieEntry>;

  constructor() {
    super("ipsum");
    this.version(1).stores({
      entries: "++entryKey",
    });
  }

  getEntry = (entryKey: string) => this.entries.get(entryKey);
}
