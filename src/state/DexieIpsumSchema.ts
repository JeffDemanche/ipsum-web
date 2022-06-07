import Dexie, { Table } from "dexie";
import { IpsumDateTime } from "util/dates";
import { InMemoryState } from "./in-memory/in-memory-state";

export interface DexieEntry {
  entryKey: string;
  date: Date;
  contentState: string; // stringified JS of DraftJS ContentState
}

export const normalizeEntry = (
  entry: DexieEntry
): InMemoryState["entries"][number] => ({
  ...entry,
  date: IpsumDateTime.fromJsDate(entry.date),
});

/**
 * A wrapper on Dexie that encapsulates "API" operations where the model being
 * interfaced with is IndexedDB storage.
 */
export class DexieIpsumSchema extends Dexie {
  entries!: Table<DexieEntry>;

  constructor() {
    super("ipsum");
    this.version(1).stores({
      entries: "++entryKey, date",
    });
  }

  loadInMemoryState = async (): Promise<InMemoryState> => {
    const inMemoryEntries = (await this.readAllEntries()).map((entry) =>
      normalizeEntry(entry)
    );
    const entries: InMemoryState["entries"] = {};
    inMemoryEntries.forEach((entry) => {
      entries[entry.entryKey] = entry;
    });

    return {
      entries,
      arcs: {},
    };
  };

  getEntry = async (entryKey: string) => this.entries.get(entryKey);

  createEntry = async ({
    entryKey,
    date,
    contentState,
  }: {
    entryKey: string;
    date: Date;
    contentState: string;
  }) => this.entries.add({ entryKey, date, contentState });

  readAllEntries = async () => this.entries.orderBy("entryKey").toArray();

  readEntriesFiltered = async (entryKeys: string[]) =>
    this.entries.where("entryKey").anyOf(entryKeys).toArray();

  readEntriesInRange = async ({
    startDate,
    endDate,
  }: {
    startDate?: Date;
    endDate?: Date;
  }) =>
    (await this.readAllEntries()).filter(
      (entry) =>
        (!startDate || entry.date.getTime() >= startDate.getTime()) &&
        (!endDate || entry.date.getTime() <= endDate.getTime())
    );

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
