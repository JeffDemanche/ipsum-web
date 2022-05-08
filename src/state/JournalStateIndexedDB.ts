import { DexieIpsumSchema } from "./DexieIpsumSchema";
import { JournalState } from "./JournalState";

/**
 * This is the implementation of JournalState that uses Dexie/IndexedDB to store
 * the journal data on the client's computer.
 */
export class JournalStateIndexedDB implements JournalState {
  private _db: DexieIpsumSchema;

  constructor() {
    this._db = new DexieIpsumSchema();
  }
}
