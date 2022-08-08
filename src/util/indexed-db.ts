import { IDBPDatabase, openDB } from "idb";
import { useEffect, useState } from "react";
import {
  initialInMemoryState,
  InMemoryState,
  stateReviver,
} from "state/in-memory/in-memory-state";

/**
 * Module for Ipsum interfacing with IndexedDB.
 */

export class IpsumIndexedDBClient {
  private _db: IDBPDatabase;

  constructor(db: IDBPDatabase) {
    this._db = db;
  }

  // All these private method are from this article
  // https://javascript.plainenglish.io/working-with-indexeddb-in-typescript-react-ad504a1bdae3

  private async getValue(tableName: string, id: string | number) {
    const tx = this._db.transaction(tableName, "readonly");
    const store = tx.objectStore(tableName);
    const result = await store.get(id);
    return result;
  }

  private async getAllValues(tableName: string) {
    const tx = this._db.transaction(tableName, "readonly");
    const store = tx.objectStore(tableName);
    const result = await store.getAll();
    return result;
  }

  private async putValue(tableName: string, value: object) {
    const tx = this._db.transaction(tableName, "readwrite");
    const store = tx.objectStore(tableName);
    const result = await store.put(value);
    return result;
  }

  private async deleteValue(tableName: string, id: number) {
    const tx = this._db.transaction(tableName, "readwrite");
    const store = tx.objectStore(tableName);
    const result = await store.get(id);
    if (!result) {
      return result;
    }
    await store.delete(id);
    return id;
  }

  public async putInMemoryState(state: InMemoryState) {
    const result = await this.putValue("autosavedStates", {
      id: state.journalId,
      state: JSON.stringify(state),
    });
    return result;
  }

  public async getInMemoryState() {
    const autosaveId = localStorage.getItem("ipsum-autosave-id");
    if (autosaveId) {
      const result = await this.getValue("autosavedStates", autosaveId);
      if (result) {
        return JSON.parse(result.state, stateReviver) as InMemoryState;
      } else {
        return initialInMemoryState;
      }
    } else {
      return initialInMemoryState;
    }
  }
}

const createIpsumIDBWrapper = async (tableNames: string[]) => {
  try {
    const db = await openDB("Ipsum", 1, {
      upgrade(db) {
        tableNames.forEach((tableName) => {
          if (!db.objectStoreNames.contains(tableName)) {
            db.createObjectStore(tableName, {
              autoIncrement: true,
              keyPath: "id",
            });
          }
        });
      },
    });
    return new IpsumIndexedDBClient(db);
  } catch (error) {
    return false;
  }
};

export const useIpsumIDBWrapper = () => {
  const [wrapper, setWrapper] = useState(
    undefined as IpsumIndexedDBClient | undefined
  );

  useEffect(() => {
    if (wrapper === undefined) {
      createIpsumIDBWrapper(["autosavedStates"]).then((result) => {
        setWrapper(result || undefined);
      });
    }
  }, [wrapper]);

  return wrapper;
};