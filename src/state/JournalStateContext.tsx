import { useLiveQuery } from "dexie-react-hooks";
import { ContentState, convertFromRaw, convertToRaw } from "draft-js";
import React, { useCallback, useMemo, useState } from "react";
import { dexieIpsumSchema } from "./DexieIpsumSchema";
import { Entry, InMemoryJournal } from "./JournalState.types";

const noop = async () => {};

export const emptyJournalState: InMemoryJournal = {
  loadedEntries: new Map(),
  loadEntry: noop,
  getAllEntryKeys: () => null,
  unloadEntry: noop,

  createOrUpdateEntry: noop,
  deleteEntry: noop,
};

export const JournalStateContext =
  React.createContext<InMemoryJournal>(emptyJournalState);

interface JournalStateProviderProps {
  children: React.ReactChild;
}

const stringifyContentState = (contentState: ContentState) =>
  JSON.stringify(convertToRaw(contentState));

const parseContentState = (contentState: string): ContentState =>
  convertFromRaw(JSON.parse(contentState));

/**
 * Provides a controller layer between components that rely on the app state and
 * the underlying model which is persisting that state. At the moment this model
 * is Dexie.js, but a server-side API could be implemented in the future.
 */
export const JournalStateDexieProvider: React.FC<JournalStateProviderProps> = ({
  children,
}: JournalStateProviderProps) => {
  const [loadedEntryKeys, setLoadedEntryKeys] = useState<ReadonlySet<string>>(
    new Set<string>()
  );

  const loadEntry = (date: string) =>
    setLoadedEntryKeys((prev) => new Set([...prev, date]));

  // TODO We should paginate, this is just in place until that gets implemented.
  const getAllEntryKeys = async () => {
    const entries = await dexieIpsumSchema.readAllEntries();
    return new Set<string>(entries.map((entry) => entry.entryKey));
  };

  const unloadEntry = (date: string) =>
    setLoadedEntryKeys((prev) => {
      const copySet = new Set(prev);
      copySet.delete(date);
      return copySet;
    });

  const loadedDexieEntries = useLiveQuery(
    () => dexieIpsumSchema.readEntries(Array.from(loadedEntryKeys)),
    [loadedEntryKeys]
  );

  const loadedEntries: InMemoryJournal["loadedEntries"] = useMemo(() => {
    const entryMap = new Map<string, Entry>();
    loadedDexieEntries?.forEach((dexieEntry) => {
      entryMap.set(dexieEntry.entryKey, {
        date: dexieEntry.date,
        contentState: parseContentState(dexieEntry.contentState),
      });
    });
    return entryMap;
  }, [loadedDexieEntries]);

  const createOrUpdateEntry: InMemoryJournal["createOrUpdateEntry"] =
    useCallback(
      async (date, contentState) => {
        if ((await dexieIpsumSchema.readEntries([date])).length > 0) {
          dexieIpsumSchema.updateEntry({
            entryKey: date,
            contentState: stringifyContentState(contentState),
          });
        } else {
          dexieIpsumSchema.createEntry({
            entryKey: date,
            date,
            contentState: stringifyContentState(contentState),
          });
        }
      },
      [dexieIpsumSchema]
    );

  const deleteEntry: InMemoryJournal["deleteEntry"] = useCallback(
    async (entryKey: string) => {
      dexieIpsumSchema.deleteEntry(entryKey);
    },
    [dexieIpsumSchema]
  );

  return (
    <JournalStateContext.Provider
      value={{
        loadedEntries,
        getAllEntryKeys,
        loadEntry,
        unloadEntry,
        createOrUpdateEntry,
        deleteEntry,
      }}
    >
      {children}
    </JournalStateContext.Provider>
  );
};
