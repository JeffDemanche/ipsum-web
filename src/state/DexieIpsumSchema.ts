import Dexie, { Table } from "dexie";

export interface DexieEntry {
  entryKey: string;
  date: string;
  contentState: string; // stringified JS of DraftJS ContentState
}

/**
 * A wrapper on Dexie that encapsulates "API" operations where the model being
 * interfaced with is IndexedDB storage.
 */
export class DexieIpsumSchema extends Dexie {
  entries!: Table<DexieEntry>;

  constructor() {
    super("ipsum");
    this.version(1).stores({
      entries: "++entryKey, date, contentState",
    });
  }

  getEntry = async (entryKey: string) => this.entries.get(entryKey);

  createEntry = async ({
    entryKey,
    date,
    contentState,
  }: {
    entryKey: string;
    date: string;
    contentState: string;
  }) => this.entries.add({ entryKey, date, contentState });

  readEntries = async (entryKeys: string[]) =>
    this.entries.where("entryKey").anyOf(entryKeys).toArray();

  readAllEntries = async () => this.entries.toArray();

  updateEntry = async ({
    entryKey,
    contentState,
  }: {
    entryKey: string;
    contentState: string;
  }) => this.entries.update(entryKey, { contentState });

  deleteEntry = async (entryKey: string) => this.entries.delete(entryKey);
}

export const dexieIpsumSchema = new DexieIpsumSchema();
