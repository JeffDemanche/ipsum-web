import type { IDBPDatabase} from "idb";
import { openDB } from "idb";
import { useEffect, useState } from "react";

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

  public async putAutosaveValue(autosaveId: string, state: string) {
    localStorage.setItem("ipsum-autosave-id", autosaveId);
    const result = await this.putValue("autosavedStates", {
      id: autosaveId,
      state,
    });
    return result;
  }

  public async getAutosaveValue() {
    const autosaveId = localStorage.getItem("ipsum-autosave-id");
    if (autosaveId) {
      const result = await this.getValue("autosavedStates", autosaveId);
      if (result) {
        return result.state as string;
      }
    }
    return undefined;
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

export let idbWrapper: IpsumIndexedDBClient | undefined;

export const useIpsumIDBWrapper = () => {
  const [wrapperRef, setWrapperRef] = useState<
    IpsumIndexedDBClient | undefined
  >();

  useEffect(() => {
    if (wrapperRef === undefined) {
      createIpsumIDBWrapper(["autosavedStates"]).then((result) => {
        idbWrapper = result || undefined;
        setWrapperRef(idbWrapper);
      });
    }
  }, [wrapperRef]);

  return wrapperRef;
};
